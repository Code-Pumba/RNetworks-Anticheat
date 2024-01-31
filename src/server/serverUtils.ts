import { Injectable } from "@public/core/decorators/injectable";
import { Projectiles } from "@public/shared/Enums/projectile";
import { Weapons } from "@public/shared/Enums/weapons";

@Injectable()
export class ServerUtils {
    public readonly RESOURCE_NAME = "rNetworks-Anticheat";
    public readonly CURRENT_VERSION = GetResourceMetadata(this.RESOURCE_NAME, "version", 0);
    public readonly RADIANS = 180 / Math.PI;
    public readonly WEAPONS_MELEE = new Set([
        // Melee Weapons
        Weapons.WEAPON_DAGGER,
        Weapons.WEAPON_BAT,
        Weapons.WEAPON_BOTTLE,
        Weapons.WEAPON_CROWBAR,
        Weapons.WEAPON_UNARMED,
        Weapons.WEAPON_FLASHLIGHT,
        Weapons.WEAPON_GOLFCLUB,
        Weapons.WEAPON_HAMMER,
        Weapons.WEAPON_HATCHET,
        Weapons.WEAPON_KNUCKLE,
        Weapons.WEAPON_KNIFE,
        Weapons.WEAPON_MACHETE,
        Weapons.WEAPON_SWITCHBLADE,
        Weapons.WEAPON_NIGHTSTICK,
        Weapons.WEAPON_WRENCH,
        Weapons.WEAPON_BATTLEAXE,
        Weapons.WEAPON_POOLCUE,
        Weapons.WEAPON_STONE_HATCHET,
        Weapons.WEAPON_CANDYCANE,
    ]);
    /**
     * Set of area-of-effect weapons.
     */
    public readonly WEAPONS_AOE = new Set([
        // Heavy Weapons
        Weapons.WEAPON_RPG,
        Weapons.WEAPON_GRENADELAUNCHER,
        Weapons.WEAPON_GRENADELAUNCHER_SMOKE,
        Weapons.WEAPON_MINIGUN,
        Weapons.WEAPON_FIREWORK,
        Weapons.WEAPON_RAILGUN,
        Weapons.WEAPON_HOMINGLAUNCHER,
        Weapons.WEAPON_COMPACTLAUNCHER,
        Weapons.WEAPON_RAYMINIGUN,
        Weapons.WEAPON_EMPLAUNCHER,
        Weapons.WEAPON_RAILGUNXM3,

        // Throwables
        Weapons.WEAPON_GRENADE,
        Weapons.WEAPON_BZGAS,
        Weapons.WEAPON_MOLOTOV,
        Weapons.WEAPON_STICKYBOMB,
        Weapons.WEAPON_PROXMINE,
        Weapons.WEAPON_PIPEBOMB,
        Weapons.WEAPON_SMOKEGRENADE,
        Weapons.WEAPON_FLARE,
        Weapons.WEAPON_FLAREGUN,
        Weapons.WEAPON_ACIDPACKAGE,

        // Miscellaneous
        Weapons.WEAPON_PETROLCAN,
        Weapons.WEAPON_PARACHUTE,
        Weapons.WEAPON_FIREEXTINGUISHER,
        Weapons.WEAPON_HIT_BY_WATER_CANNON,
    ]);

    /**
     * Set of vehicle weapons.
     */
    public readonly WEAPONS_VEHICLE = new Set([
        // Vehicle Weapons
        Weapons.VEHICLE_WEAPON_TANK,
        Weapons.VEHICLE_WEAPON_PLAYER_BUZZARD,
        Weapons.VEHICLE_WEAPON_PLAYER_HUNTER,
        Weapons.VEHICLE_WEAPON_PLANE_ROCKET,
        Weapons.VEHICLE_WEAPON_SPACE_ROCKET,
        Weapons.VEHICLE_WEAPON_APC_CANNON,
        Weapons.VEHICLE_WEAPON_APC_MISSILE,
        Weapons.VEHICLE_WEAPON_APC_MG,
        Weapons.VEHICLE_WEAPON_TURRET_INSURGENT,
        Weapons.VEHICLE_WEAPON_TURRET_TECHNICAL,
        Weapons.VEHICLE_WEAPON_NOSE_TURRET_VALKYRIE,
        Weapons.VEHICLE_WEAPON_TURRET_VALKYRIE,
        Weapons.VEHICLE_WEAPON_CANNON_BLAZER,
        Weapons.VEHICLE_WEAPON_TURRET_BOXVILLE,
        Weapons.VEHICLE_WEAPON_RUINER_BULLET,
        Weapons.VEHICLE_WEAPON_RUINER_ROCKET,
        Weapons.VEHICLE_WEAPON_HUNTER_MG,
        Weapons.VEHICLE_WEAPON_HUNTER_MISSILE,
        Weapons.VEHICLE_WEAPON_HUNTER_CANNON,
        Weapons.VEHICLE_WEAPON_HUNTER_BARRAGE,
        Weapons.VEHICLE_WEAPON_TULA_NOSEMG,
        Weapons.VEHICLE_WEAPON_TULA_MG,
        Weapons.VEHICLE_WEAPON_TULA_DUALMG,
        Weapons.VEHICLE_WEAPON_TULA_MINIGUN,
        Weapons.VEHICLE_WEAPON_SEABREEZE_MG,
        Weapons.VEHICLE_WEAPON_MICROLIGHT_MG,
        Weapons.VEHICLE_WEAPON_DOGFIGHTER_MG,
        Weapons.VEHICLE_WEAPON_DOGFIGHTER_MISSILE,
        Weapons.VEHICLE_WEAPON_MOGUL_NOSE,
        Weapons.VEHICLE_WEAPON_MOGUL_DUALNOSE,
        Weapons.VEHICLE_WEAPON_MOGUL_TURRET,
        Weapons.VEHICLE_WEAPON_MOGUL_DUALTURRET,
        Weapons.VEHICLE_WEAPON_ROGUE_MG,
        Weapons.VEHICLE_WEAPON_ROGUE_CANNON,
        Weapons.VEHICLE_WEAPON_ROGUE_MISSILE,
        Weapons.VEHICLE_WEAPON_BOMBUSHKA_DUALMG,
        Weapons.VEHICLE_WEAPON_BOMBUSHKA_CANNON,
        Weapons.VEHICLE_WEAPON_HAVOK_MINIGUN,
        Weapons.VEHICLE_WEAPON_VIGILANTE_MG,
        Weapons.VEHICLE_WEAPON_VIGILANTE_MISSILE,
        Weapons.VEHICLE_WEAPON_TURRET_LIMO,
        Weapons.VEHICLE_WEAPON_DUNE_MG,
        Weapons.VEHICLE_WEAPON_DUNE_GRENADELAUNCHER,
        Weapons.VEHICLE_WEAPON_DUNE_MINIGUN,
        Weapons.VEHICLE_WEAPON_TAMPA_MISSILE,
        Weapons.VEHICLE_WEAPON_TAMPA_MORTAR,
        Weapons.VEHICLE_WEAPON_TAMPA_FIXEDMINIGUN,
        Weapons.VEHICLE_WEAPON_TAMPA_DUALMINIGUN,
        Weapons.VEHICLE_WEAPON_HALFTRACK_DUALMG,
        Weapons.VEHICLE_WEAPON_HALFTRACK_QUADMG,
    ]);

    /**
     * Set of non-lethal weapons.
     */
    public readonly WEAPONS_NON_LETHAL = new Set([
        // Harmless Weapons
        Weapons.WEAPON_SNOWBALL,
        Weapons.WEAPON_BALL,
        Weapons.WEAPON_HAZARDCAN,
        Weapons.WEAPON_FERTILIZERCAN,
        Weapons.WEAPON_STUNGUN,
        Weapons.WEAPON_STUNGUN_MP,
        Weapons.WEAPON_SMOKEGRENADE,
        Weapons.WEAPON_NIGHTVISION,
    ]);

    /**
     * Set of non-lethal projectiles.
     */
    public readonly PROJECTILES_NON_LETHAL = new Set([
        // Harmless Weapons
        Projectiles.PROJECTILE_FLARE,
        Projectiles.PROJECTILE_SNOWBALL,
        Projectiles.PROJECTILE_BALL,
    ]);

    /**
     * Set of missile projectiles.
     */
    public readonly PROJECTILES_MISSILE = new Set([
        // Missiles
        Projectiles.PROJECTILE_RPGMISSILE,
        Projectiles.PROJECTILE_HOMINGMISSILE,
        Projectiles.PROJECTILE_HYDRAMISSILE,
        Projectiles.PROJECTILE_LAZERMISSILE,
        Projectiles.PROJECTILE_RHINOMISSILE,
        Projectiles.PROJECTILE_FIREWORKMISSILE,
    ]);

    /**
     * Set of throwable projectiles.
     */
    public readonly PROJECTILES_THROWABLE = new Set([
        // Throwables
        Projectiles.PROJECTILE_GRENADE,
        Projectiles.PROJECTILE_MOLOTOV,
        Projectiles.PROJECTILE_BZGAS,
        Projectiles.PROJECTILE_TEARGAS,
        Projectiles.PROJECTILE_PIPEBOMB,
        Projectiles.PROJECTILE_PROXIMITYMINE,
        Projectiles.PROJECTILE_STICKYBOMB,
    ]);

    public hasify(arr: string[]) {
        return arr.map((x) => this.joaat(x))
    }

    public joaat(str: string): number {
        let hash = 0;

        for (let i = 0; i < str.length; ++i) {
            hash += str.charCodeAt(i);
            hash += hash << 10;
            hash ^= hash >>> 6;
        }

        hash += hash << 3;
        hash ^= hash >>> 11;
        hash += hash << 15;

        return (hash >>> 0) << 0;
    }

    public getDistance(coords1: number[], coords2: number[], includeZ: boolean = false): number {
        const x = coords1[0] - coords2[0];
        const y = coords1[1] - coords2[1];

        if (coords1.length >= 3 && coords2.length >= 3 && coords1[2] !== undefined && coords2[2] !== undefined) {
            const z = coords1[2] - coords2[2];

            return Math.sqrt(x * x + y * y + z * z);
        }

        return Math.sqrt(x * x + y * y);
    }

    public getForwardVector(yaw: number): number[] {
        // Why does that work? I have no idea, but it does
        const yawRad = (yaw * this.RADIANS * Math.PI) / 180;
        // Calculate the components of the forward vector
        return [-Math.sin(yawRad), Math.cos(yawRad)];
    }

    public hasNoclip(ped: number, source: string) {
        return (IsEntityPositionFrozen(ped) || GetPlayerInvincible(source)) && (!IsEntityVisible(ped) || GetEntityCollisionDisabled(ped)) && GetVehiclePedIsIn(ped, false) === 0;
    }
}