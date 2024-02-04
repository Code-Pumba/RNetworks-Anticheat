import { On } from "@public/core/decorators/event";
import { Inject } from "@public/core/decorators/injectable";
import { Provider } from "@public/core/decorators/provider";
import { Logger } from "@public/core/logger";
import { ConfigProvider } from "@public/server/Config/config.provider";
import { BanController } from "@public/server/System/System.ban.controller";
import { GameEvents } from "@public/shared/Enums/gameEvents.enum";
import { StartProjectileEvent } from "@public/shared/Types/Events";
import { WeaponTypes } from "@public/shared/weapons";


@Provider()
export class EventStartProjectile {
    @Inject(ConfigProvider)
    private configProvider: ConfigProvider;

    @Inject(BanController)
    private banController: BanController;

    @Inject(Logger)
    private logger: Logger;

    @Inject(WeaponTypes)
    private weaponTypes: WeaponTypes;

    private readonly _projectileCooldown: Map<string, number> = new Map();
    private _projectileCooldownTime: number = 0;

    @On(GameEvents.StartProjectileEvent, false)
    public onStartProjectile(source: string, data: StartProjectileEvent) {
        const module = "Anti-Projectile";
        const _moduleSetting = this.configProvider.getModuleSetting(module);
        if (!_moduleSetting.Enabled) return;

        if (this._projectileCooldown.has(source)) {
            const lastTime = this._projectileCooldown.get(source);
            if (Math.abs(GetGameTimer() - lastTime) < this._projectileCooldownTime) {
                this.banController.Ban(source, module);
                return;
            }
        }

        this._projectileCooldown.set(source, GetGameTimer());
        if (this.weaponTypes.WEAPONS_VEHICLE.has(data.weaponHash)) {
            this.banController.Ban(source, module);
            return;
        }
    }
}