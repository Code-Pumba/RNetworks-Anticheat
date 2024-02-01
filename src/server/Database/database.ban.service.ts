import { Inject, Injectable } from "@public/core/decorators/injectable";
import { DatabaseProvider } from "./database.provider";
import { Ban } from "@public/shared/Types/Ban.types";
import { PlayerStateService } from "../Player/playerState.service";
import { Logger } from "@public/core/logger";

@Injectable()
export class DatabaseBanService {
    @Inject(DatabaseProvider)
    private database: DatabaseProvider;

    @Inject(PlayerStateService)
    private playerStateService: PlayerStateService;

    @Inject(Logger)
    private logger: Logger;

    public async getAllBans(): Promise<Ban[]> {
        return await this.database.query<Ban[]>("SELECT * FROM `bans`");
    }

    public async insertBan(source: number, reason: string, duration: number): Promise<void> {
        const Identifier = this.playerStateService.getCredentials(source);
        if (Identifier.Steam && Identifier.Discord && Identifier.FiveM && Identifier.Token !== null) {
            await this.database.insert("INSERT INTO `bans` (`Steam`, `FiveM`, `Discord`, `Token`, `Token_2`, `Reason`, `Duration`) VALUES (?, ?, ?, ?, ?, ?, ?)", [
                Identifier.Steam,
                Identifier.FiveM,
                Identifier.Discord,
                Identifier.Token,
                Identifier.Token_2,
                reason,
                duration
            ]);
        } else {
            this.logger.info("There is a Missing Identifier in DatabaseBanService:insertBan - " + Identifier.Discord + Identifier.FiveM + Identifier.Steam + Identifier.Token + Identifier.Token_2);
        }
    }

    public async isPlayerBanned(source: number): Promise<boolean> {
        const Identifier = this.playerStateService.getCredentials(source);
        return await this.database.exists("SELECT `Duration` FROM `bans` WHERE `Steam` = ? OR `FiveM` = ? OR `Discord` = ? OR `Token` = ? OR `Token_2` = ?", [Identifier.Steam, Identifier.FiveM, Identifier.Discord, Identifier.Token, Identifier.Token_2]);
    }
}