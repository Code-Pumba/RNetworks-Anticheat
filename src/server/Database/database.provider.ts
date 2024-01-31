import { Once, OnceStep } from "@public/core/decorators/event";
import { Inject } from "@public/core/decorators/injectable";
import { Provider } from "@public/core/decorators/provider";
import { OnceLoader } from "@public/core/loader/once.loader";
import { Logger } from "@public/core/logger";
import { wait } from "@public/core/utils";
import { DbConnection, Dict, MySqlRow, OkPacket } from "@public/shared/Types/database.types";
import { createPool, Pool, PoolConfig, PoolConnection, QueryOptions } from "mariadb";

(Symbol as any).dispose ??= Symbol('Symbol.dispose');
// Big Thanks to Overextended for this: https://github.com/overextended/ox_core/blob/ts/server/db/index.ts
@Provider()
export class DatabaseProvider {

    @Inject(Logger)
    private logger: Logger;

    @Inject(OnceLoader)
    private onceLoader: OnceLoader;

    private pool: Pool

    private isServerConnected: boolean = false;

    @Once()
    public async init(): Promise<void> {
        try {
            this.pool = createPool(await this.connectionConfig());
            this.isServerConnected = true;

            const version = await this.column<string>("SELECT VERSION() as version")

            this.logger.info(`[${version}]: Database Connection established!`);
            this.onceLoader.trigger(OnceStep.DatabaseConnected);
        } catch (error) {
            this.logger.error(error);
        }
    }

    public async query<T>(query: string, values?: any[]) {
        await this.awaitConnection()
        return this.pool.query<T>(query, values);
    }
    public async execute<T>(query: string, values?: any[]) {
        await this.awaitConnection();
        return this.pool.execute<T>(query, values);
    }
    public async column<T>(query: string, values?: any[]) {
        return this.scalar(await this.execute<MySqlRow<T>[]>(query, values));
    }
    async exists<T>(query: string, values?: any[]) {
        return this.scalar(await this.execute<MySqlRow<T>[]>(query, values)) === 1;
    }
    async row<T>(query: string, values?: any[]) {
        return this.single(await this.execute<T[]>(query, values));
    }
    async insert(query: string, values?: any[]) {
        return (await this.execute<OkPacket>(query, values)).insertId;
    }
    async update(query: string, values?: any[]) {
        return (await this.execute<OkPacket>(query, values)).affectedRows;
    }
    public batch(query: string, values?: any[]) {
        return this.batch(query, values);
    }
    public scalar<T>(resp: MySqlRow<T>[]): T {
        if (resp[0]) for (const key in resp[0]) return resp[0][key];
    }
    public single<T>(resp: T[]): T {
        return resp[0];
    }

    private async awaitConnection() {
        while (!this.isServerConnected) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Timeout für 1 Sekunde
        }
    }

    private async connectionConfig(): Promise<PoolConfig> {
        const connectionString = GetConvar("mysql_connection_string", "mysql://root@localhost").replace(
            'mysql://',

            'mariadb://'
        );

        const options: any = connectionString.includes('mariadb://')
            ? this.parseUri(connectionString)
            : connectionString
                .replace(/(?:host(?:name)|ip|server|data\s?source|addr(?:ess)?)=/gi, 'host=')
                .replace(/(?:user\s?(?:id|name)?|uid)=/gi, 'user=')
                .replace(/(?:pwd|pass)=/gi, 'password=')
                .replace(/(?:db)=/gi, 'database=')
                .split(';')
                .reduce((connectionInfo: any, parameter: any) => {
                    const [key, value] = parameter.split('=');
                    if (key) connectionInfo[key] = value;
                    return connectionInfo;
                }, {});

        if (typeof options.ssl === 'string') {
            try {
                options.ssl = JSON.parse(options.ssl);
            } catch (err) {
                console.log(`^3Failed to parse ssl in configuration (${err})!^0`);
            }
        }
        return {
            connectTimeout: 60000,
            ...options,
            namedPlaceholders: false,
            connectionLimit: true,
            multipleStatements: true,
            dateStrings: true,
            insertIdAsNumber: true,
            decimalAsNumber: true,
            autoJsonMap: false,
        };
    }

    private parseUri(connectionString: string) {
        const splitMatchGroups = connectionString.match(
            new RegExp(
                '^(?:([^:/?#.]+):)?(?://(?:([^/?#]*)@)?([\\w\\d\\-\\u0100-\\uffff.%]*)(?::([0-9]+))?)?([^?#]+)?(?:\\?([^#]*))?$'
            )
        ) as RegExpMatchArray;

        if (!splitMatchGroups) throw new Error(`mysql_connection_string structure was invalid (${connectionString})`);

        const authTarget = splitMatchGroups[2] ? splitMatchGroups[2].split(':') : [];

        return {
            user: authTarget[0] || undefined,
            password: authTarget[1] || undefined,
            host: splitMatchGroups[3],
            port: parseInt(splitMatchGroups[4]),
            database: splitMatchGroups[5].replace(/^\/+/, ''),
            ...(splitMatchGroups[6] &&
                splitMatchGroups[6].split('&').reduce<Dict<string>>((connectionInfo, parameter) => {
                    const [key, value] = parameter.split('=');
                    connectionInfo[key] = value;
                    return connectionInfo;
                }, {})),
        };
    }

    public async getConnection(): Promise<PoolConnection> {
        while (!this.isServerConnected) {
            await wait(0);
        }

        const connection = (await this.pool.getConnection()) as DbConnection;

        connection[Symbol.dispose] = connection.release;

        return connection;
    }
}