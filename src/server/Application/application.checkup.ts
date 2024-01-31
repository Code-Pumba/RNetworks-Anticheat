import { Inject, Injectable } from "@public/core/decorators/injectable";
import { Logger } from "@public/core/logger";
import { DatabaseProvider } from "../Database/database.provider";
import { Ban, BanInterface, BanModel } from "@public/shared/Types/Ban.types";


interface TableDescription {
    Field: string;
    // Weitere Eigenschaften hier hinzufügen, falls nötig
}

@Injectable()
export class CheckupService {

    @Inject(DatabaseProvider)
    private database: DatabaseProvider;

    @Inject(Logger)
    private logger: Logger;

    public async Init(): Promise<void> {
        try {
            this.logger.info("Initializing Application... Checking Database...");
            // Überprüfe, ob die Tabelle existiert
            const tableExists = await this.checkTableExists('bans');

            if (!tableExists) {
                this.logger.info("Table does not exist, creating...");
                // Tabelle existiert nicht, also erstelle sie neu
                await this.createTable();
            } else {
                this.logger.info("Table exists, checking structure...");
                // Tabelle existiert, überprüfe die Spaltenstruktur
                await this.checkTableStructure();
            }
        } catch (error) {
            this.logger.error(error);
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

        try {
            const result: TableDescription[] = await this.database.query(query); // Hier die Typisierung für das Ergebnis angeben

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