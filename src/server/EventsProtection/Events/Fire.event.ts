import { On } from "@public/core/decorators/event";
import { Inject } from "@public/core/decorators/injectable";
import { Provider } from "@public/core/decorators/provider";
import { Logger } from "@public/core/logger";
import { ConfigProvider } from "@public/server/Config/config.provider";
import { BanController } from "@public/server/System/System.ban.controller";
import { GameEvents } from "@public/shared/Enums/gameEvents.enum";
import { Utils } from "@public/shared/utils";


@Provider()
export class EventFire {
    @Inject(ConfigProvider)
    private configProvider: ConfigProvider;

    @Inject(BanController)
    private banController: BanController;

    @Inject(Logger)
    private logger: Logger;

    @Inject(Utils)
    private utils: Utils;

    private _maxFireDistance = 128.0;

    @On(GameEvents.FireEvent, false)
    public onFireEvent(source: string, data: any) {
        const module = "Anti-Fire";
        const _moduleSetting = this.configProvider.getModuleSetting(module);
        if (!_moduleSetting.Enabled) return;

        const victim = NetworkGetEntityFromNetworkId(data.entityGlobalId ?? 0);
        if (!DoesEntityExist(victim)) return;

        const ped = GetPlayerPed(victim);
        const distance = this.utils.getDistance(GetEntityCoords(ped), GetEntityCoords(victim));

        if (distance > this._maxFireDistance) {
            this.banController.Ban(source, module);
            CancelEvent()
            return;
        }
    }
}