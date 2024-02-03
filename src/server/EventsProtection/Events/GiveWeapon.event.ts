import { On } from "@public/core/decorators/event";
import { Inject } from "@public/core/decorators/injectable";
import { Provider } from "@public/core/decorators/provider";
import { Logger } from "@public/core/logger";
import { ConfigProvider } from "@public/server/Config/config.provider";
import { BanController } from "@public/server/System/System.ban.controller";
import { GameEvents } from "@public/shared/Enums/gameEvents.enum";
import { GiveWeaponEvent } from "@public/shared/Types/Events";


@Provider()
export class EventClearPedTask {
    @Inject(ConfigProvider)
    private configProvider: ConfigProvider;

    @Inject(BanController)
    private banController: BanController;

    @Inject(Logger)
    private logger: Logger;

    @On(GameEvents.GiveWeaponEvent, false)
    public onGiveWeapon(source: string, data: GiveWeaponEvent) {
        const module = "Anti-GiveWeapon";
        const _moduleSetting = this.configProvider.getModuleSetting(module);
        if (!_moduleSetting.Enabled) return;

        const entity = NetworkGetEntityFromNetworkId(data.pedId);
        if (!DoesEntityExist(entity)) return;

        const weaponReciever = NetworkGetEntityOwner(entity);

        if (source != weaponReciever.toString()) {
            this.banController.Ban(source, module);
        }
    }
}