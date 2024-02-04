import { On } from "@public/core/decorators/event";
import { Inject } from "@public/core/decorators/injectable";
import { Provider } from "@public/core/decorators/provider";
import { Logger } from "@public/core/logger";
import { ConfigProvider } from "@public/server/Config/config.provider";
import { BanController } from "@public/server/System/System.ban.controller";
import { GameEvents } from "@public/shared/Enums/gameEvents.enum";
import { PtFxEvent } from "@public/shared/Types/Events";


@Provider()
export class EventptFx {
    @Inject(ConfigProvider)
    private configProvider: ConfigProvider;

    @Inject(BanController)
    private banController: BanController;

    @Inject(Logger)
    private logger: Logger;

    private maxParticleScale: number = 5.0 + 0.01;

    @On(GameEvents.PtFxEvebt, false)
    public ptFxEvent(source: string, data: PtFxEvent) {
        const module = "Anti-PTFX"
        const _moduleSetting = this.configProvider.getModuleSetting(module);
        if (!_moduleSetting.Enabled) return;

        if (data.isOnEntity && data.entityNetId > 0) {
            const entityOwner = NetworkGetEntityOwner(NetworkGetEntityFromNetworkId(data.entityNetId));
            if (entityOwner.toString() === source) return;

            this.banController.Ban(source, module);
            CancelEvent()
            return;
        }

        if (data.scale > this.maxParticleScale) {
            this.banController.Ban(source, module);
            CancelEvent()
            return;
        }
    }
}