import { Inject } from "@public/core/decorators/injectable";
import { DatabaseProvider } from "../Database/database.provider";
import { Logger } from "@public/core/logger";
import { Provider } from "@public/core/decorators/provider";
import { Once, OnceStep } from "@public/core/decorators/event";
import { BanModel, BanInterface } from "@public/shared/Types/database.ban.types";
import { BanEntities } from "../Database/models/ban.model";

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

    @Once(OnceStep.DatabaseConnected)
    public async Init(): Promise<void> {
        this.logger.info("System Check Up Initiated");
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
}