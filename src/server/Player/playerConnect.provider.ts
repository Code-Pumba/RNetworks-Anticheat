import { On, Once } from "@public/core/decorators/event";
import { Inject } from "@public/core/decorators/injectable";
import { Provider } from "@public/core/decorators/provider";
import { Logger } from "@public/core/logger";
import { wait } from "@public/core/utils";
import { GameEvents } from "@public/shared/Enums/gameEvents";
import { Deferrals } from "@public/shared/Types/GameEvents.types";
import fetch from "node-fetch";
import { ConfigProvider } from "../Config/config.provdier";
import { DatabaseBanService } from "../Database/database.ban.service";

@Provider()
export class PlayerProvider {

    @Inject(Logger)
    private logger: Logger;

    @Inject(ConfigProvider)
    private config: ConfigProvider;

    @Inject(DatabaseBanService)
    private databaseBanService: DatabaseBanService;

    private badNames: Set<string> = new Set();

    @Once()
    public async init(): Promise<void> {
        this.badNames = new Set(this.config.badNameList);
    }

    @On(GameEvents.PlayerConnecting, false)
    public async onPlayerConnecting(
        name: string,
        setKickReason: (reason: string) => void,
        deferrals: Deferrals
    ): Promise<void> {
        const _source = source
        const Ipv4 = GetPlayerIdentifierByType(_source, "ip").slice(3);
        const steamId = GetPlayerIdentifierByType(_source, "steam");

        deferrals.defer();
        await wait(0);

        this.logger.debug(`PlayerConnecting: ${name} | SteamID: ${steamId} | IP: ${Ipv4}`);

        if (!steamId) {
            deferrals.done("SteamID not found!");
            return;
        }

        if (!this.IsAlphaNumeric(name) || this.badNames.has(name)) {
            deferrals.done(this.badNames.has(name) ? "Your name contains bad words!" : "Your name is not alphanumeric!");
            return;
        }

        if (await this.databaseBanService.isPlayerBanned(_source)) {
            deferrals.done("You are banned!");
            return;
        }

        if (Ipv4 === "192.168.0.48") {
            deferrals.done();
            return;
        }

        try {
            if (await this.HasVPN(Ipv4)) {
                this.logger.debug("VPN Detected: " + Ipv4);
                deferrals.done("VPN Detected!");
                return;
            }
            deferrals.done();
        } catch (error) {
            this.logger.error(error);
        }
    }

    private IsAlphaNumeric(str: string): boolean {
        return /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/g.test(str);
    }

    private async HasVPN(Ipv4: string): Promise<boolean> {
        const response = await fetch(`https://blackbox.ipinfo.app/lookup/${Ipv4}`, {
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