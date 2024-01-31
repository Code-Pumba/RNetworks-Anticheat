import { Inject } from "@public/core/decorators/injectable";
import { Provider } from "@public/core/decorators/provider";
import { DatabaseProvider } from "../Database/database.provider";
import { OnEvent, Once } from "@public/core/decorators/event";
import { Logger } from "@public/core/logger";
import { Ban } from "@public/shared/Types/Ban.types";
import { DatabaseBanService } from "../Database/database.ban.service";
import { Exportable } from "@public/core/decorators/exports";


@Provider()
export class ApplicationBanProvider {

    @Inject(Logger)
    private logger: Logger

    @Inject(DatabaseBanService)
    private databaseBanService: DatabaseBanService

    private _bans: Ban[] = [];

    @Once()
    public async Init(): Promise<void> {
        this._bans = await this.databaseBanService.getAllBans();
        this.logger.info(`Loaded ${this._bans.length} Bans from Database.`)
    }

    @Exportable("banPlayer")
    @OnEvent("rNetworks:Anticheat:BanPlayer.server")
    public async banPlayer(player: number, reason: string = "System-Ban", duration: number = 30): Promise<void> {
        if (player === 0) return;
        await this.databaseBanService.insertBan(source, reason, duration);
        this.logger.info(`BanPlayer: ${player} | Reason: ${reason} | Duration: ${duration}`)
        DropPlayer(player.toString(), reason);
    }
}