import { Inject, Injectable } from "@public/core/decorators/injectable";
import { joaat } from "./joaat";
import { Vector3 } from "./Types/vector.types";
import { Logger } from "@public/core/logger";
import axios from "axios";

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
        return /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=.-]+$/g.test(str);
    }


    public async hasVpn(Ip: string): Promise<boolean> {
        try {
            const response = await axios.get(`https://blackbox.ipinfo.app/lookup/${Ip}`, {
                headers: {
                    "User-Agent": "axios"
                }
            });

            if (!response.data) {
                throw new Error(`Empty response received`);
            }

            if (response.status === 500) { //TODO: Find a new way for Anti-Vpn
                return false;
            }

            return response.data[0] === "Y";
        } catch (error) {
            if (axios.isAxiosError(error)) {
                this.logger.error(`Axios ERROR! STATUS: ${error.response?.status}`);
                throw new Error(`Axios ERROR! STATUS: ${error.response?.status}`);
            } else {
                this.logger.error(`Axios ERROR! ${error.message}`);
                throw new Error(`Axios ERROR! ${error.message}`);
            }
        }
    }

    public async isUsingVpn(playerIP: string): Promise<boolean> {
        try {
            const response = await axios.get(`http://check.getipintel.net/check.php?ip=${playerIP}&contact=lgerrist1808@outlook.de&flags=m`);

            if (response.data) {
                const intValue = parseFloat(response.data);
                return intValue >= 0.5; // Return true if probability is greater than or equal to 0.5
            }

            return false; // Return false if response.data is null or undefined
        } catch (error) {
            console.error('Error during HTTP request:', error);
            return false; // Return false in case of an error
        }
    }

}