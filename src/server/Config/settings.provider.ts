import { Once } from "@public/core/decorators/event";
import { Inject } from "@public/core/decorators/injectable";
import { Provider } from "@public/core/decorators/provider";
import { Logger } from "@public/core/logger";

import { Config, Module, Settings } from "@public/shared/Types/config.types";
import { ServerUtils } from "../serverUtils";


@Provider()
export class SettingsProvider {

    @Inject(Logger)
    private logger: Logger;

    @Inject(ServerUtils)
    private serverUtils: ServerUtils;

    private Settings: Config;

    @Once()
    public Init(): void {
        this.Settings = JSON.parse(LoadResourceFile(this.serverUtils.RESOURCE_NAME, "config/config.json"));

        this.logger.info(`Loaded Settings from Config.json - ${this.getEnabledModules()}/${this.getSettingCount()}`)
    }

    public getSettings(Module: string): Module {
        return this.Settings.Modules[Module]
    }

    public getSettingCount(): number {
        return Object.keys(this.Settings.Modules).length
    }

    public getEnabledModules(): number {
        return Object.keys(this.Settings.Modules).filter(x => this.Settings.Modules[x].Enabled).length
    }
}