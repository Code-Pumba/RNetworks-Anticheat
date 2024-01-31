import { Inject, Injectable } from "@public/core/decorators/injectable";
import { DatabaseProvider } from "./database.provider";
import { Ban } from "@public/shared/Types/Ban.types";

@Injectable()
export class DatabaseBanService {
    @Inject(DatabaseProvider)
    private database: DatabaseProvider;

    public async getAllBans(): Promise<Ban[]> {
        return await this.database.query<Ban[]>("SELECT * FROM `bans`");
    }

    public async insertBan(source: number, reason: string, duration: number): Promise<void> {
        const BanParams = [ //! Needs another place for this shit
            GetPlayerIdentifierByType(source.toString(), "steam"),
            GetPlayerIdentifierByType(source.toString(), "license"),
            GetPlayerIdentifierByType(source.toString(), "discord"),
            GetPlayerToken(source.toString(), 0),
            GetPlayerToken(source.toString(), GetNumPlayerTokens(source.toString())),
            reason,
            duration
        ]
        await this.database.insert("INSERT INTO `bans` (`Steam`, `FiveM`, `Discord`, `Token`, `Token_2`, `Reason`, `Duration`) VALUES (?, ?, ?, ?, ?, ?, ?)", BanParams);
    }
}