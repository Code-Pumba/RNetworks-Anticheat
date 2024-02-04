import { Inject } from "@public/core/decorators/injectable";
import { DatabaseProvider } from "../Database/database.provider";
import { Logger } from "@public/core/logger";
import { Provider } from "@public/core/decorators/provider";
import { Once, OnceStep } from "@public/core/decorators/event";
import { BanModel, BanInterface } from "@public/shared/Types/database.ban.types";
import { BanEntities } from "../Database/models/ban.model";
import { Utils } from "@public/shared/utils";

interface TableDescription {
    Field: string;
}

@Provider()
export class SystemCheckUpService {

    @Inject(DatabaseProvider)
    private database: DatabaseProvider;

    @Inject(Logger)
    private logger: Logger;

    @Inject(BanEntities)
    private banModel: BanEntities;

    @Inject(Utils)
    private utils: Utils;

    @Once(OnceStep.DatabaseConnected)
    public async Init(): Promise<void> {
        this.logger.info("System Check Up Initiated");
        this.CheckServer();
        try {
            const tableExists = await this.checkTableExists('bans');

            if (!tableExists) {
                this.logger.info("Table does not exist, creating...");
                await this.createTable();
            } else {
                this.logger.info("Table exists, checking structure...");
                await this.checkTableStructure();
            }
            this.banModel.getAllBans();
            this.CheckServerConvars();
        } catch (error) {
            this.logger.error("System Check Up Error: " + error);
        }
    }

    private async checkTableExists(tableName: string): Promise<boolean> {
        const query = `SHOW TABLES LIKE '${tableName}'`;
        const result: any[] = await this.database.query(query);
        return result.length > 0;
    }

    private async checkTableStructure(): Promise<void> {
        const expectedColumns = BanModel.columns;
        const query = `DESCRIBE bans`;
        const queryToRemove = `DROP TABLE IF EXISTS bans`;

        try {
            const result: TableDescription[] = await this.database.query(query);

            const existingColumns = result.map(row => row.Field);

            const missingColumns = expectedColumns.filter(column => !existingColumns.includes(column));

            if (missingColumns.length > 0) {
                this.logger.error(`Missing columns in bans table: ${missingColumns.join(', ')}`);
                return;
                // Logik für das Hinzufügen fehlender Spalten hier einfügen, falls erforderlich
            }
            this.logger.info("Table structure is up to date.");
        } catch (error) {
            this.logger.error(error);
        }
    }

    private async createTable(): Promise<void> {
        const query = `
            CREATE TABLE bans (
                id INT AUTO_INCREMENT PRIMARY KEY,
                Steam VARCHAR(255),
                FiveM VARCHAR(255),
                Discord VARCHAR(255),
                Token VARCHAR(255),
                Token_2 VARCHAR(255),
                Reason VARCHAR(255),
                Duration VARCHAR(255)
            )
        `;
        await this.database.query(query);
        this.logger.info('Table `bans` created successfully.');
    }

    private async CheckServerConvars(): Promise<void> {
        const convars = [
            { name: "onesync", recommendedValue: "on" },
            { name: "sv_scriptHookAllowed", recommendedValue: "false" },
            { name: "sv_enableNetworkedPhoneExplosions", recommendedValue: "false" },
            { name: "sv_enableNetworkedSounds", recommendedValue: "false" },
            { name: "sv_enforceGameBuild", recommendedValue: "2944" },
        ];

        for (const convar of convars) {
            const convarValue = GetConvar(convar.name, "");
            if (convarValue !== convar.recommendedValue) {
                this.logger.warn(`Convar ${convar.name} is not set to ${convar.recommendedValue} this could lead to Serious Errors!`);
            }
        }
    }

    private async CheckServer(): Promise<void> {
        const _version = GetResourceMetadata(this.utils.resourceName, "version", 0);
        if (_version !== this.utils.currentVersion) { //! SPÄTER API CALL
            this.logger.warn(`Resource ${this.utils.resourceName} is outdated!`);
        } else {
            this.logger.info(`Resource ${this.utils.resourceName} is up to date!`);
        }
        const _resourceName = GetCurrentResourceName()
        if (_resourceName !== this.utils.resourceName) {
            this.logger.warn(`Resource name is not ${this.utils.resourceName} this could lead to Serious Errors!`);
        } else {
            this.logger.info(`Current Resource Name is Correct: - ${this.utils.resourceName}!`);
        }
    }
}