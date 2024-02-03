import { Once, OnceStep } from "@public/core/decorators/event";
import { Inject } from "@public/core/decorators/injectable";
import { Provider } from "@public/core/decorators/provider";
import { Logger } from "@public/core/logger";
import { Utils } from "@public/shared/utils";
import { Config, Module, Settings } from "@public/shared/Types/config.types";

@Provider()
export class ConfigProvider {

    @Inject(Utils)
    private utils: Utils;

    @Inject(Logger)
    private logger: Logger;

    private BlacklistedWeapons: string[] = []
    private BlacklistedEntities: string[] = []
    private WhitelistedExplosions: number[] = []
    private WhitelistedModels: string[] = []
    private BlacklistedEvents: string[] = []
    private BadWordsList: string[] = []
    private BadNameList: string[] = []
    private _config: Config;

    // private FileNames = [
    //     "data/BlacklistedWeapons.json",
    //     "data/BlacklistedEntities.json",
    //     "data/WhitelistedExplosions.json",
    //     "data/WhitelistedModels.json",
    //     "data/BlacklistedEvents.json",
    //     "data/BadWordsList.json",
    //     "data/BadNameList.json"
    // ]

    @Once()
    private LoadConfig(): void {
        this.BlacklistedEntities = JSON.parse(LoadResourceFile(this.utils.resourceName, "data/BlacklistedEntities.json"))
        this.BlacklistedWeapons = JSON.parse(LoadResourceFile(this.utils.resourceName, "data/BlacklistedWeapons.json"))
        this.WhitelistedExplosions = JSON.parse(LoadResourceFile(this.utils.resourceName, "data/WhitelistedExplosions.json"))
        this.WhitelistedModels = JSON.parse(LoadResourceFile(this.utils.resourceName, "data/WhitelistedModels.json"))
        this.BlacklistedEvents = JSON.parse(LoadResourceFile(this.utils.resourceName, "data/BlacklistedEvents.json"))
        this.BadWordsList = JSON.parse(LoadResourceFile(this.utils.resourceName, "data/BadWords.json"))
        this.BadNameList = JSON.parse(LoadResourceFile(this.utils.resourceName, "data/BadNames.json"))
        this._config = JSON.parse(LoadResourceFile(this.utils.resourceName, "config/config.json"))

        this.logger.info(`Loaded Settings from Config.json - ${this.getEnabledModules()}/${this.getSettingCount()}`)
    }

    public get hashedBlacklistedEntities(): number[] {
        return this.utils.hashArray(this.BlacklistedEntities);
    }

    public get hashedBlacklistedWeapons(): number[] {
        return this.utils.hashArray(this.BlacklistedWeapons);
    }

    public get whitelistedExplosions(): number[] {
        return this.WhitelistedExplosions;
    }

    public get hashedWhitelistedModels(): number[] {
        return this.utils.hashArray(this.WhitelistedModels);
    }

    public get blacklistedEvents(): string[] {
        return this.BlacklistedEvents;
    }

    public get badWordsList(): string[] {
        return this.BadWordsList;
    }

    public get badNameList(): string[] {
        return this.BadNameList;
    }

    //** Config Part **//

    /**
     * Get settings for a specific module.
     *
     * @param {string} Module - the name of the module
     * @return {Module} the settings for the specified module
     */
    public getModuleSetting(Module: string): Module {
        return this._config.Modules[Module]
    }

    public getSettings(): Settings {
        return this._config.Settings;
    }

    /**
     * Get the count of settings.
     *
     * @return {number} the count of settings
     * Useless Function only for the Init Function used.
     */
    public getSettingCount(): number {
        return Object.keys(this._config.Modules).length
    }

    /**
     * Get the number of enabled modules.
     *
     * @return {number} the number of enabled modules
     * Useless Function only for the Init Function used.
     */
    public getEnabledModules(): number {
        return Object.keys(this._config.Modules).filter(x => this._config.Modules[x].Enabled).length
    }
}