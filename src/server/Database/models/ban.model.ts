import { Inject, Injectable } from "@public/core/decorators/injectable";
import { DatabaseProvider } from "../database.provider";
import { Logger } from "@public/core/logger";
import { BanInterface } from "@public/shared/Types/database.ban.types";
import { PlayerIdentifier } from "@public/shared/Types/player.types";


@Injectable()
export class BanEntities {

    @Inject(DatabaseProvider)
    private databaseProvider: DatabaseProvider;

    @Inject(Logger)
    private logger: Logger;

    private bans: BanInterface[] = [];

    public async getAllBans(): Promise<any> {
        this.bans = await this.databaseProvider.query("SELECT * FROM `bans`");
        this.logger.info(`There were ${this.bans.length} found in the Database`)
    }

    public async insertBan(Identifier: PlayerIdentifier, reason: string, duration: number): Promise<boolean> {
        if (!Identifier) return false;
        if (!reason) {
            reason = "Reason Missing"
        };
        const result = await this.databaseProvider.insert("INSERT INTO `bans` (`Steam`, `FiveM`, `Discord`, `Token`, `Token_2`, `Reason`, `Duration`) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [Identifier.Steam, Identifier.FiveM, Identifier.Discord, Identifier.PlayerToken, Identifier.PlayerToken_2, reason, duration]);
        if (result > 0) {
            this.logger.debug("Successfully inserted into the Database")
            return true
        }
        return false
    }

    public async checkBan(Identifier: PlayerIdentifier): Promise<boolean> {
        return await this.databaseProvider.exists("SELECT * FROM `bans` WHERE FiveM = ? OR Discord = ?, Steam = ?, OR Token = ?, Token_2 = ?", [Identifier.FiveM, Identifier.Discord, Identifier.Steam, Identifier.PlayerToken, Identifier.PlayerToken_2]);
    }
}