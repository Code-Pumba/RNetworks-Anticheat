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
     * External Ban a user for a specified reason and duration.
     *
     * @param {string} source - the user to be banned
     * @param {string} module - The Module module
     * @param {string} reason - the reason for the ban
     * @param {number} [duration=30] - the duration of the ban in days
     * @return {Promise<void>} a Promise that resolves when the user is banned
     */
    public async Ban(source: string, module?: string): Promise<void> {
        const _source = source;
        const Identifier = this.playerStateService.getAllIdentifier(_source);
        module = module || "Anticheat-Detection";
        const banMessage = this.config.getModuleSetting(module).Message;
        const banDuration = this.config.getModuleSetting(module).Duration;

        const success = await this.banModel.insertBan(Identifier, banMessage, banDuration);

        if (success) {
            DropPlayer(source, banMessage);
            return;
        }

        this.logger.error(`Failed to ban ${Identifier.Steam || Identifier.FiveM} for ${module}`);

        return;
    }

    public async internalBan(source: string, module: string): Promise<void> {
        return;
    }
}