import { Inject, Injectable } from "@public/core/decorators/injectable";
import { joaat } from "./joaat";
import { Vector3 } from "./Types/vector.types";
import { Logger } from "@public/core/logger";

@Injectable()
export class Utils {

    @Inject(Logger)
    private logger: Logger;

    private readonly RESOURCE_NAME = "rNetworks-Anticheat";
    private readonly CURRENT_VERSION = "1.0.0";
    private readonly RADIANS = 180 / Math.PI;

    public get resourceName(): string {
        return this.RESOURCE_NAME;
    }

    public get currentVersion(): string {
        return this.CURRENT_VERSION;
    }

    public hashArray(arr: string[]): number[] {
        return arr.map(str => joaat(str));
    }

    public getDistance(coords1: number[], coords2: number[]): number {
        const x = coords1[0] - coords2[0];
        const y = coords1[1] - coords2[1];

        if (coords1.length >= 3 && coords2.length >= 3 && coords1[2] !== undefined && coords2[2] !== undefined) {
            const z = coords1[2] - coords2[2];

            return Math.sqrt(x * x + y * y + z * z);
        }

        return Math.sqrt(x * x + y * y);
    }

    public getForwardVector(yaw: number): number[] {
        const yawRad = (yaw * this.RADIANS * Math.PI) / 180;
        return [-Math.sin(yawRad), Math.cos(yawRad)];
    }

    public isInNoclip(ped: number, source: number): boolean {
        return (IsEntityPositionFrozen(ped) || GetPlayerInvincible(source)) && (!IsEntityVisible(ped) || GetEntityCollisionDisabled(ped)) && GetVehiclePedIsIn(ped, false) === 0;
    }

    public isAlphaNumeric(str: string): boolean {
        return /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/g.test(str);
    }

    public async hasVpn(Ip: string): Promise<boolean> {
        const response = await fetch(`https://blackbox.ipinfo.app/lookup/${Ip}`, {
            method: "GET",
            headers: {
                "User-Agent": "request"
            }
        })
        if (!response.ok) {
            this.logger.error(`HTTP ERROR! STATUS: ${response.status}`)
            throw new Error(`HTTP ERROR! STATUS: ${response.status}`)
        }
        return (await response.text())[0] == "Y";
    }

}