import { On, Once } from "@public/core/decorators/event";
import { Inject } from "@public/core/decorators/injectable";
import { Provider } from "@public/core/decorators/provider";
import { Logger } from "@public/core/logger";
import { ConfigProvider } from "@public/server/Config/config.provider";
import { BanController } from "@public/server/System/System.ban.controller";
import { GameEvents } from "@public/shared/Enums/gameEvents.enum";
import { ExplosionEvent } from "@public/shared/Types/Events";


@Provider()
export class EventExplosion {
    @Inject(ConfigProvider)
    private configProvider: ConfigProvider;

    @Inject(BanController)
    private banController: BanController;

    @Inject(Logger)
    private logger: Logger;

    private whitelistedExplosions: Set<number>;

    @Once()
    public async Init(): Promise<void> {
        this.whitelistedExplosions = new Set(this.configProvider.whitelistedExplosions);
    }

    @On(GameEvents.ExplosionEvent, false)
    public explosionEvent(source: string, data: ExplosionEvent) {
        const module = "Anti-Explosions"
        const _moduleSetting = this.configProvider.getModuleSetting(module);
        if (!_moduleSetting.Enabled) return;

        if (!this.whitelistedExplosions.has(data.explosionType)) {
            this.banController.Ban(source, module);
        }
    }
}