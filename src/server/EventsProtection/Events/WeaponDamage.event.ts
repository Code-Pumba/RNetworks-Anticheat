import { On } from "@public/core/decorators/event";
import { Inject } from "@public/core/decorators/injectable";
import { Provider } from "@public/core/decorators/provider";
import { Logger } from "@public/core/logger";
import { ConfigProvider } from "@public/server/Config/config.provider";
import { BanController } from "@public/server/System/System.ban.controller";
import { GameEvents } from "@public/shared/Enums/gameEvents.enum";
import { WeaponDamageEvent } from "@public/shared/Types/Events";
import { Utils } from "@public/shared/utils";
import { WeaponTypes } from "@public/shared/weapons";

@Provider()
export class EventWeaponDamage {

    @Inject(Utils)
    private utils: Utils;

    @Inject(BanController)
    private banController: BanController;

    @Inject(Logger)
    private logger: Logger;

    @Inject(ConfigProvider)
    private config: ConfigProvider;

    @Inject(WeaponTypes)
    private weaponTypes: WeaponTypes;

    private _offsetDist: number = 4.5;

    @On(GameEvents.WeaponDamageEvent, false)
    public async AntiAimbot(source: string, data: WeaponDamageEvent): Promise<void> {
        const module = "Anti-Aimbot";
        const _moduleSetting = this.config.getModuleSetting(module);
        if (!_moduleSetting.Enabled) return;

        const target = data.hitGlobalId || data.hitGlobalIds[0]
        const weaponType = data.weaponType;

        if (this.weaponTypes.WEAPONS_MELEE.has(weaponType) || this.weaponTypes.WEAPONS_AOE.has(weaponType)) return;

        const entityTarget = NetworkGetEntityFromNetworkId(target);

        if (!DoesEntityExist(entityTarget) || !IsPedAPlayer(entityTarget) || GetEntityHealth(entityTarget) === 0 || IsPedRagdoll(entityTarget)) return;

        const _source = source;
        const weaponUser = GetPlayerPed(_source);

        if (GetVehiclePedIsIn(weaponUser, false) !== 0) return;

        const UserCoords = GetEntityCoords(weaponUser);
        const TargetCoords = GetEntityCoords(entityTarget);

        const yaw = GetPlayerCameraRotation(_source)[2];
        const forwardVector = this.utils.getForwardVector(yaw);
        const distanceToTarget = this.utils.getDistance(UserCoords, TargetCoords);

        const extendedForward = [
            UserCoords[0] + forwardVector[0] * distanceToTarget,
            UserCoords[1] + forwardVector[1] * distanceToTarget,
        ]

        if (this.utils.getDistance(UserCoords, extendedForward) > this._offsetDist) {
            this.banController.Ban(_source, module);
            return;
        }
    }

    @On(GameEvents.WeaponDamageEvent, false)
    public async OnGodmode(_: string, data: WeaponDamageEvent): Promise<void> {
        const module = "Anti-Godmode";
        const _moduleSetting = this.config.getModuleSetting(module);
        if (!_moduleSetting.Enabled) return;
        const source = _;

        const netId = data.hitGlobalId || data.hitGlobalIds[0];
        const entityTarget = NetworkGetEntityFromNetworkId(netId);

        if (IsPedAPlayer(entityTarget) && GetPlayerInvincible(entityTarget)) {
            this.banController.Ban(source, module);
            return;
        }
    }

}