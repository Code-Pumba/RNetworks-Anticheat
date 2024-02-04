import { On } from "@public/core/decorators/event";
import { Inject } from "@public/core/decorators/injectable";
import { Provider } from "@public/core/decorators/provider";
import { Logger } from "@public/core/logger";
import { ConfigProvider } from "@public/server/Config/config.provider";
import { BanController } from "@public/server/System/System.ban.controller";
import { GameEvents } from "@public/shared/Enums/gameEvents.enum";
import { RemoveAllWeaponsEvent, RemoveWeaponEvent } from "@public/shared/Types/Events";


@Provider()
export class EventRemoveWeapons {
    @Inject(ConfigProvider)
    private configProvider: ConfigProvider;

    @Inject(BanController)
    private banController: BanController;

    @Inject(Logger)
    private logger: Logger;

    @On(GameEvents.RemoveAllWeaponsEvent, false)
    public onRemoveAllWeapons(source: string, data: RemoveAllWeaponsEvent) {
        const module = "Anti-RemoveWeapons";
        const _moduleSetting = this.configProvider.getModuleSetting(module);
        if (!_moduleSetting.Enabled) return;

        const entity = NetworkGetEntityFromNetworkId(data.pedId);

        if (!DoesEntityExist(entity)) return;

        const entityOwner = NetworkGetEntityOwner(entity);

        if (source === entityOwner.toString()) return;

        this.banController.Ban(source, module);
    }

    @On(GameEvents.RemoveWeaponsEvent, false)
    public onRemoveWeapons(source: string, data: RemoveWeaponEvent) {
        const module = "Anti-RemoveWeapons";
        const _moduleSetting = this.configProvider.getModuleSetting(module);
        if (!_moduleSetting.Enabled) return;

        const entity = NetworkGetEntityFromNetworkId(data.pedId);

        if (!DoesEntityExist(entity)) return;

        const entityOwner = NetworkGetEntityOwner(entity);

        if (source === entityOwner.toString()) return;

        this.banController.Ban(source, module);
    }
}