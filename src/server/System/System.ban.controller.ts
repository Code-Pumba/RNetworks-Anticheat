import { Inject } from "@public/core/decorators/injectable";
import { Provider } from "@public/core/decorators/provider";
import { Logger } from "@public/core/logger";
import { PlayerStateService } from "../Player/player.state.service";
import { ConfigProvider } from "../Config/config.provider";
import { BanEntities } from "../Database/models/ban.model";
import { OnEvent } from "@public/core/decorators/event";
import { Exportable } from "@public/core/decorators/exports";


@Provider()
export class BanController {

    @Inject(Logger)
    private logger: Logger;

    @Inject(PlayerStateService)
    private playerStateService: PlayerStateService;

    @Inject(ConfigProvider)
    private config: ConfigProvider;

    @Inject(BanEntities)
    private banModel: BanEntities;

    @Exportable("banPlayer")
    @OnEvent("anticheat:system:ban.server")
    /**
     * Ban a user for a specified reason and duration.
     *
     * @param {string} source - the user to be banned
     * @param {string} type - The Module type
     * @param {string} reason - the reason for the ban
     * @param {number} [duration=30] - the duration of the ban in days
     * @return {Promise<void>} a Promise that resolves when the user is banned
     */
    public async Ban(source: string, type?: string): Promise<void> {
        const _source = source;
        const Identifier = this.playerStateService.getAllIdentifier(_source);
        const banMessage = this.config.getModuleSetting(type).Message;
        const banDuration = this.config.getModuleSetting(type).Duration;

        if (!type) {
            type = "Anticheat-Detection";
        }

        const success = await this.banModel.insertBan(Identifier, banMessage, banDuration);

        if (success) {
            DropPlayer(source, banMessage);
            return;
        }

        this.logger.error(`Failed to ban ${Identifier.Steam || Identifier.FiveM} for ${type}`);

        return;
    }
}