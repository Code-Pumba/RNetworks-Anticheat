import { On, Once } from "@public/core/decorators/event";
import { Inject } from "@public/core/decorators/injectable";
import { Provider } from "@public/core/decorators/provider";
import { Logger } from "@public/core/logger";
import { ConfigProvider } from "@public/server/Config/config.provider";
import { BanController } from "@public/server/System/System.ban.controller";
import { GameEvents } from "@public/shared/Enums/gameEvents.enum";
import { Weapons } from "@public/shared/Enums/weapons.enum";


@Provider()
export class EventEntityCreated {
    @Inject(ConfigProvider)
    private configProvider: ConfigProvider;

    @Inject(BanController)
    private banController: BanController;

    @Inject(Logger)
    private logger: Logger;

    private blacklistedEntites: Set<number>;
    private blacklistedWeapons: Set<number>;
    private whitelistedModels: Set<number>;

    @Once()
    public async Init(): Promise<void> {
        this.blacklistedEntites = new Set(this.configProvider.hashedBlacklistedEntities);
        this.blacklistedWeapons = new Set(this.configProvider.hashedBlacklistedWeapons);
        this.whitelistedModels = new Set(this.configProvider.hashedWhitelistedModels);
    }

    @On(GameEvents.EntityCreated, false)
    public OnEntityCreated(entity: number) {
        const module = "Anti-Model-Object-Vehicle-Spawner"
        const _moduleSetting = this.configProvider.getModuleSetting(module);
        if (!_moduleSetting.Enabled) return;

        if (!DoesEntityExist(entity)) return;
        const entityOwner = NetworkGetFirstEntityOwner(entity);

        if (this.blacklistedEntites.has(GetEntityModel(entity))) {
            if (entityOwner) {
                this.banController.Ban(entityOwner.toString(), module);
            }
            DeleteEntity(entity);
            return;
        }

        const rootEntity = GetEntityAttachedTo(entity);
        if (rootEntity > 0 && NetworkGetFirstEntityOwner(rootEntity) !== entityOwner) {
            this.banController.Ban(entityOwner.toString(), module);
            DeleteEntity(entity);
            return;
        }

        const weapon = GetSelectedPedWeapon(entity);

        switch (weapon) {
            case 0:
            case Weapons.WEAPON_UNARMED:
                return;
            default:
                break;
        }

        if (GetEntityType(entity) === 1 && this.blacklistedWeapons.has(weapon)) {
            if (entityOwner) {
                this.banController.Ban(entityOwner.toString(), module);
            }
            DeleteEntity(entity);
            return;
        }
    }

    @On(GameEvents.PlayerLeftScope, false)
    @On(GameEvents.PlayerEnteredScope, false)
    public AntiModelChanger(source: number) {
        const module = "Anti-ModelChanger";
        const _moduleSetting = this.configProvider.getModuleSetting(module);
        if (!_moduleSetting.Enabled) return;

        const ped = GetPlayerPed(source);
        const model = GetEntityModel(ped)

        if (!this.whitelistedModels.has(model)) {
            this.banController.Ban(source.toString(), module);
        }
    }

}