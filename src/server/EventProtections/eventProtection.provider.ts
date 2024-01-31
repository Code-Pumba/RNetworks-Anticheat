import { Inject } from "@public/core/decorators/injectable";
import { Provider } from "@public/core/decorators/provider";
import { Logger } from "@public/core/logger";
import { ServerUtils } from "../serverUtils";
import { On, OnEvent, Once } from "@public/core/decorators/event";
import { GameEvents } from "@public/shared/Enums/gameEvents";
import { ExplosionEvent, GiveWeaponEvent, PtFxEvent, RemoveAllWeaponsEvent, WeaponDamageEvent, RemoveWeaponEvent, StartProjectileEvent } from "@public/shared/Types/GameEvents.types";
import { ConfigProvider } from "../Config/config.provdier";
import { Weapons } from "@public/shared/Enums/weapons";
import { Tick, TickInterval } from "@public/core/decorators/tick";
import { wait } from "@public/core/utils";
import { SettingsProvider } from "../Config/settings.provider";
import { ApplicationBanProvider } from "../Application/application.ban.provider";

@Provider()
export class EventProtection {
    @Inject(Logger)
    private logger: Logger;

    @Inject(ServerUtils)
    private serverUtils: ServerUtils;

    @Inject(ConfigProvider)
    private config: ConfigProvider;

    @Inject(SettingsProvider)
    private settings: SettingsProvider;

    @Inject(ApplicationBanProvider)
    private applicationBanProvider: ApplicationBanProvider;

    private _offsetDist: number = 4.5;
    private _maxFireDistance: number = 128.0;
    private _speedThreshold: number = 20.0;
    private _maxParticlesScale: number = 5.0 + 0.001;
    private _projectileCooldownTime: number = 0;
    private _blockVehicleWeapons: boolean = true;
    private _tazerCooldown: number = 14000;
    private _tazerRange: number = 12;
    private _damageModifier: number = 1.0;

    private _BlacklistEntities: Set<number>;
    private _BlacklistedWeapons: Set<number>;
    private _WhitelistedExplosions: Set<number>;
    private _WhitelistedModels: Set<number>;
    private _BlacklistedEvents: Set<string>;
    private _BadWordsList: Set<string>;
    private readonly _projectileCooldown: Map<number, number> = new Map();
    private readonly _onCooldown: Set<number> = new Set<number>();

    @Once()
    public async init(): Promise<void> {
        this._BlacklistEntities = new Set(this.config.blacklistedEntities);
        this._BlacklistedWeapons = new Set(this.config.blacklistedWeapons);
        this._WhitelistedExplosions = new Set(this.config.whitelistedExplosions);
        this._WhitelistedModels = new Set(this.config.whitelistedModels);
        this._BlacklistedEvents = new Set(this.config.blacklistedEvents);
        this._BadWordsList = new Set(this.config.badWordsList);
        this.ProtectEvents();
    }

    private ProtectEvents(): void {
        this._BlacklistedEvents.forEach(event => {
            addEventListener(event, this.AntiEventExecuter, false)
        });
    }

    private AntiEventExecuter() {
        throw new Error('Not Implemented');
    }

    @On(GameEvents.WeaponDamageEvent, false)
    private onAimbot(source: number, data: WeaponDamageEvent) {
        if (!this.settings.getSettings("Anti-Aimbot").Enabled) return;
        const target = data.hitGlobalId || data.hitGlobalIds[0];
        const weaponType = data.weaponType;

        if (this.serverUtils.WEAPONS_MELEE.has(weaponType) || this.serverUtils.WEAPONS_AOE.has(weaponType)) return;
        const victim = NetworkGetEntityFromNetworkId(target);
        if (!DoesEntityExist(victim) || !IsPedAPlayer(victim) || GetEntityHealth(victim) === 0 || IsPedRagdoll(victim)) return;

        const sender = source.toString();
        const killer = GetPlayerPed(sender);

        if (GetVehiclePedIsIn(killer, false) !== 0) return;

        const killerCoords = GetEntityCoords(killer);
        const victimCoords = GetEntityCoords(victim);

        const yaw = GetPlayerCameraRotation(sender)[2];
        const forwardVector: number[] = this.serverUtils.getForwardVector(yaw);
        const distanceToVictim = this.serverUtils.getDistance(killerCoords, victimCoords, false)

        const extendedForward: number[] = [
            killerCoords[0] + forwardVector[0] * distanceToVictim,
            killerCoords[1] + forwardVector[1] * distanceToVictim,
        ];

        if (this.serverUtils.getDistance(killerCoords, extendedForward, false) < this._offsetDist) {
            this.logger.warn(`[EventProtection]: Aimbot detected!`);
            ///!TODO: Ban-Event
            this.applicationBanProvider.banPlayer(source, this.settings.getSettings("Anti-Aimbot").Message, this.settings.getSettings("Anti-Aimbot").Duration);
            CancelEvent()
        }
    }

    @On(GameEvents.WeaponDamageEvent, false)
    private OnGodmode(_: number, data: WeaponDamageEvent) {
        if (!this.settings.getSettings("Anti-Godmode").Enabled) return;
        const netId = data.hitGlobalId || data.hitGlobalIds[0];
        const target = NetworkGetEntityFromNetworkId(netId);
        if (IsPedAPlayer(target) && GetPlayerInvincible(target.toString())) {
            this.logger.warn(`[EventProtection]: Godmode detected!`);
            ///!TODO: Ban-Event
            this.applicationBanProvider.banPlayer(source, this.settings.getSettings("Anti-Godmode").Message, this.settings.getSettings("Anti-Godmode").Duration);
            CancelEvent()
        }
    }

    @On(GameEvents.WeaponDamageEvent, false)
    private TazerReach(source: number, data: WeaponDamageEvent) {
        if (!this.settings.getSettings("TazerReach").Enabled) return;
        switch (data.weaponType) {
            case Weapons.WEAPON_STUNGUN:
            case Weapons.WEAPON_STUNGUN_MP:
                const killer: number = GetPlayerPed(source.toString());
                const victim: number = NetworkGetEntityFromNetworkId(data.hitGlobalId || data.hitGlobalIds[0]);
                if (!DoesEntityExist(victim) || !IsPedAPlayer(victim)) return;

                if (this.serverUtils.getDistance(GetEntityCoords(killer), GetEntityCoords(victim), true) > this._tazerRange) {
                    this.logger.warn("[EventProtection]: Tazer Reach detected!");
                    ///!TODO: Ban-Event
                    this.applicationBanProvider.banPlayer(source, this.settings.getSettings("TazerReach").Message, this.settings.getSettings("TazerReach").Duration);
                    CancelEvent();
                }
                break;
            default:
                return;
        }
    }

    @On(GameEvents.WeaponDamageEvent, false)
    private onTazerCooldown(source: number, data: WeaponDamageEvent) {
        if (!this.settings.getSettings("TazerReach").Enabled) return;
        switch (data.weaponType) {
            case Weapons.WEAPON_STUNGUN:
            case Weapons.WEAPON_STUNGUN_MP:
                if (this._onCooldown.has(source)) {
                    this.logger.warn("[EventProtection]: Tazer cooldown detected!");
                    this.applicationBanProvider.banPlayer(source, this.settings.getSettings("TazerReach").Message, this.settings.getSettings("TazerReach").Duration);
                    CancelEvent();
                } else {
                    this._onCooldown.add(source);
                    setTimeout(() => {
                        this._onCooldown.delete(source);
                    }, this._tazerCooldown);
                }
                break;
            default:
                return;
        }
    }

    @On(GameEvents.WeaponDamageEvent, false)
    private async onTazerRagdoll(source: number, data: WeaponDamageEvent) {
        if (!this.settings.getSettings("TazerReach").Enabled) return;
        switch (data.weaponType) {
            case Weapons.WEAPON_STUNGUN:
            case Weapons.WEAPON_STUNGUN_MP:
                const target = data.hitGlobalId || data.hitGlobalIds[0];
                const victim: number = NetworkGetEntityFromNetworkId(target);
                if (!DoesEntityExist(victim) || !IsPedAPlayer(victim)) return;
                SetPedCanRagdoll(victim, true); // Is this a good idea?

                let hasRagdolled = false;
                const start = GetGameTimer();
                const threshold = 3000 + GetPlayerPing(target.toString());

                while (!hasRagdolled && GetGameTimer() - start < threshold) {
                    if (IsPedRagdoll(victim)) hasRagdolled = true;
                    await wait(100);
                }
                if (!hasRagdolled) {
                    this.logger.warn("[EventProtection]: Tazer ragdoll detected!");
                    this.applicationBanProvider.banPlayer(source, this.settings.getSettings("TazerReach").Message, this.settings.getSettings("TazerReach").Duration);
                    CancelEvent();
                }
                break;
            default:
                return;
        }
    }

    @On(GameEvents.WeaponDamageEvent, false)
    private async BlacklistedWeapon(source: number, data: WeaponDamageEvent) {
        if (this._BlacklistedWeapons.has(data.weaponType)) {
            this.logger.warn(`[EventProtection]: Illegal Weapon used!`);
            ///!TODO: Ban-Event
            CancelEvent()
        }
    }

    @On(GameEvents.WeaponDamageEvent, false)
    private async WeaponModifier(source: number) {
        if (!this.settings.getSettings("Anti-BlacklistedWeapons").Enabled) return;
        if ((GetPlayerMeleeWeaponDamageModifier(source) || GetPlayerWeaponDamageModifier(source) || GetPlayerWeaponDefenseModifier(source)) > this._damageModifier) {
            this.logger.warn(`[EventProtection]: Illegal Weapon Modifier used!`);
            ///!TODO: Ban-Event
            this.applicationBanProvider.banPlayer(source, this.settings.getSettings("Anti-BlacklistedWeapons").Message, this.settings.getSettings("Anti-BlacklistedWeapons").Duration);
            CancelEvent();
            return;
        }
    }

    @On(GameEvents.ChatMessage, false)
    private onChatMessage(source: number, _: string, message: string) {
        if (!this.settings.getSettings("Chat-Message-Profane").Enabled) return;
        if (message.startsWith("/") && this._BadWordsList.has(message)) {
            this.logger.warn(`[EventProtection]: Illegal Chat Command used!`);
            ///!TODO: Ban-Event
            CancelEvent()
        }
        if (message.startsWith("!") && this._BadWordsList.has(message)) {
            this.logger.warn(`[EventProtection]: Illegal Chat Command used!`);
            ///!TODO: Ban-Event
            CancelEvent()
        }
        if (message.startsWith("@") && this._BadWordsList.has(message)) {
            this.logger.warn(`[EventProtection]: Illegal Chat Command used!`);
            ///!TODO: Ban-Event
            CancelEvent()
        }
        if (this._BadWordsList.has(message)) {
            this.logger.warn(`[EventProtection]: Illegal Chat Command used!`);
            ///!TODO: Ban-Event
            CancelEvent()
        }
    }

    @On(GameEvents.ClearPedTasksEvent, false)
    private onClearPedTasks(source: number) {
        this.applicationBanProvider.banPlayer(source, this.settings.getSettings("Anti-ClearTasks").Message, this.settings.getSettings("ClearPedTasks").Duration);
        this.logger.warn("[EventProtection]: ClearPedTasksEvent detected!");
        ///!TODO: Ban-Event
        CancelEvent()
    }

    @On(GameEvents.EntityCreated, false)
    private onEntityCreated(entity: number) {
        if (!this.settings.getSettings("Anti-Model-Object-Vehicle-Spawner").Enabled) return;
        if (!DoesEntityExist(entity)) return;
        const owner: number = NetworkGetFirstEntityOwner(entity);

        if (this._BlacklistEntities.has(GetEntityModel(entity))) {
            this.logger.warn(`[EventProtection]: Illegal Entity created!`);
            DeleteEntity(entity)
            this.applicationBanProvider.banPlayer(source, this.settings.getSettings("Anti-Model-Object-Vehicle-Spawner").Message, this.settings.getSettings("Anti-Model-Object-Vehicle-Spawner").Duration);
            ///!TODO: Ban-Event
            CancelEvent()
            return;
        }

        const rootEntity: number = GetEntityAttachedTo(entity);
        if (rootEntity > 0 && NetworkGetFirstEntityOwner(rootEntity) !== owner) {
            this.logger.warn(`[EventProtection]: Illegal Entity created!`);
            DeleteEntity(entity)
            this.applicationBanProvider.banPlayer(source, this.settings.getSettings("Anti-Model-Object-Vehicle-Spawner").Message, this.settings.getSettings("Anti-Model-Object-Vehicle-Spawner").Duration);
            ///!TODO: Ban-Event
            CancelEvent()
            return;
        }

        ///!TODO THIS NEEDS CHECKING

        const weapon: number = GetSelectedPedWeapon(entity);
        switch (weapon) {
            case 0:
            case Weapons.WEAPON_UNARMED:
                return;
            default:
                break;
        }
        if (GetEntityType(entity) === 1 && this._BlacklistedWeapons.has(weapon)) {
            this.logger.warn(`[EventProtection]: Illegal Entity with Weapon created!`);
            this.applicationBanProvider.banPlayer(source, this.settings.getSettings("Anti-Model-Object-Vehicle-Spawner").Message, this.settings.getSettings("Anti-Model-Object-Vehicle-Spawner").Duration);
            DeleteEntity(entity)
            ///!TODO: Ban-Event
            CancelEvent()
            return;
        }
    }

    @On(GameEvents.ExplosionEvent, false)
    private onExplosion(source: number, data: ExplosionEvent) {
        if (!this._WhitelistedExplosions.has(data.explosionType) || data.damageScale > 1.0 || data.isInvisible) {
            this.logger.warn(`[EventProtection]: Explosion detected!`);
            ///!TODO: Ban-Event
            CancelEvent()
            return;
        }
    }

    @On(GameEvents.FireEvent, false)
    private onFireEvent(source: number, data: any) {
        if (!this.settings.getSettings("Anti-Fire").Enabled) return;
        if (!data.isEntity || source == data.entityGlobalId) return;

        const victim = NetworkGetEntityFromNetworkId(data.entityGlobalId ?? 0);
        if (!DoesEntityExist(victim)) return;

        const ped = GetPlayerPed(source.toString())
        const dist = this.serverUtils.getDistance(GetEntityCoords(ped), GetEntityCoords(victim), false);

        if (dist > this._maxFireDistance) {
            this.logger.warn(`[EventProtection]: FireEvent detected!`);
            this.applicationBanProvider.banPlayer(source, this.settings.getSettings("Anti-Fire").Message, this.settings.getSettings("Anti-Fire").Duration);
            ///!TODO: Ban-Event
            CancelEvent()
            return;
        }
    }

    @On(GameEvents.GiveWeaponEvent, false)
    private onGiveWeapOn(source: number, data: GiveWeaponEvent) {
        const entity = NetworkGetEntityFromNetworkId(data.pedId);
        if (DoesEntityExist(entity)) {
            const owner = NetworkGetEntityOwner(entity);
            if (source != owner) {
                this.logger.warn(`[EventProtection]: GiveWeapOn detected!`);
                ///!TODO: Ban-Event
                CancelEvent()
                return;
            }
        }
    }

    @Tick(TickInterval.EVERY_FRAME)
    private async onTick() {
        const players = getPlayers();
        players.forEach(async (player: string) => {
            const ped = GetPlayerPed(player);
            if (!this.serverUtils.hasNoclip(ped, player)) return;
            const origin = GetEntityCoords(ped);
            await wait(1000)
            if (!DoesEntityExist(ped)) return;
            const destination = GetEntityCoords(ped);

            const speed = this.serverUtils.getDistance(origin, destination, false) * 3.6; //! KM/H
            if (speed > this._speedThreshold && this.serverUtils.hasNoclip(ped, player)) {
                this.logger.warn(`[EventProtection]: Noclip detected!`);
                ///!TODO: Ban-Event
            }

            if (IsPlayerUsingSuperJump(player)) {
                this.logger.warn(`[EventProtection]: Superjump detected!`);
                ///!TODO: Ban-Event
            }
        })
        await wait(4000);
    }

    @On(GameEvents.PtFxEvebt, false)
    private onPtFxEvent(source: number, data: PtFxEvent) {
        if (data.isOnEntity && data.entityNetId > 0) {
            const owner = NetworkGetEntityOwner(NetworkGetEntityFromNetworkId(data.entityNetId));
            if (owner != source) {
                this.logger.warn(`[EventProtection]: PtFxEvent detected!`);
                ///!TODO: Ban-Event
                CancelEvent()
                return;
            }
        }
        if (data.scale > this._maxParticlesScale) {
            this.logger.warn(`[EventProtection]: PtFxEvent detected!`);
            ///!TODO: Ban-Event
            CancelEvent()
            return;
        }
    }

    @On(GameEvents.PlayerLeftScope, false)
    @On(GameEvents.PlayerEnteredScope, false)
    private onPlayerEnteredScope(source: number) {
        const ped = GetPlayerPed(source.toString())
        const model = GetEntityModel(ped);
        if (!this._WhitelistedModels.has(model)) {
            this.logger.warn(`[EventProtection]: ModelChanger detected!`);
            ///!TODO: Ban-Event
            CancelEvent()
            return;
        }
    }

    @On(GameEvents.RemoveAllWeaponsEvent, false)
    private onRemoveAllWeaponsEvent(source: number, data: RemoveAllWeaponsEvent) {
        const entity: number = NetworkGetEntityFromNetworkId(data.pedId);
        if (DoesEntityExist(entity)) {
            const owner = NetworkGetEntityOwner(entity);
            if (source != owner) {
                this.logger.warn(`[EventProtection]: RemoveWeapons detected!`);
                ///!TODO: Ban-Event
                CancelEvent()
                return;
            }
        }
    }

    @On(GameEvents.RemoveWeaponsEvent, false)
    private onRemoveWeaponsEvent(source: number, data: RemoveWeaponEvent) {
        const entity: number = NetworkGetEntityFromNetworkId(data.pedId);
        if (DoesEntityExist(entity)) {
            const owner = NetworkGetEntityOwner(entity);
            if (source != owner) {
                this.logger.warn(`[EventProtection]: RemoveWeapons detected!`);
                ///!TODO: Ban-Event
                CancelEvent()
                return;
            }
        }
    }

    @On(GameEvents.StartProjectileEvent, false)
    private onStartProjectileEvent(source: number, data: StartProjectileEvent) {
        if (this._projectileCooldown.has(source)) {
            const lastTime = this._projectileCooldown.get(source);
            if (!lastTime) return;
            if (Math.abs(GetGameTimer() - lastTime) < this._projectileCooldownTime) {
                this.logger.warn(`[EventProtection]: ProjectileEvent detected!`);
                ///!TODO: Ban-Event
                CancelEvent()
                return;
            }
        }

        this._projectileCooldown.set(source, GetGameTimer());
        if (this._blockVehicleWeapons && this.serverUtils.WEAPONS_VEHICLE.has(data.weaponHash)) {
            this.logger.warn(`[EventProtection]: ProjectileEvent-VEHICLE-WEAPON detected!`);
            ///!TODO: Ban-Event
            CancelEvent()
            return;
        }
    }

}