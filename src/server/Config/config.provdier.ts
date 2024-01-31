import { Once } from "@public/core/decorators/event";
import { Inject } from "@public/core/decorators/injectable";
import { Provider } from "@public/core/decorators/provider";
import { ServerUtils } from "../serverUtils";


@Provider()
export class ConfigProvider {
    private BlacklistedWeapons: string[] = []
    private BlacklistedEntities: string[] = []
    private WhitelistedExplosions: number[] = []
    private WhitelistedModels: string[] = []
    private BlacklistedEvents: string[] = []
    private BadWordsList: string[] = []
    private BadNameList: string[] = []

    @Inject(ServerUtils)
    private serverUtils: ServerUtils;

    @Once()
    public async init(): Promise<void> {
        this.BlacklistedEntities = JSON.parse(LoadResourceFile(this.serverUtils.RESOURCE_NAME, "data/BlacklistedEntities.json"))
        this.BlacklistedWeapons = JSON.parse(LoadResourceFile(this.serverUtils.RESOURCE_NAME, "data/BlacklistedWeapons.json"))
        this.WhitelistedExplosions = JSON.parse(LoadResourceFile(this.serverUtils.RESOURCE_NAME, "data/WhitelistedExplosions.json"))
        this.WhitelistedModels = JSON.parse(LoadResourceFile(this.serverUtils.RESOURCE_NAME, "data/WhitelistedModels.json"))
        this.BlacklistedEvents = JSON.parse(LoadResourceFile(this.serverUtils.RESOURCE_NAME, "data/BlacklistedEvents.json"))
        this.BadWordsList = JSON.parse(LoadResourceFile(this.serverUtils.RESOURCE_NAME, "data/BadWords.json"))
        this.BadNameList = JSON.parse(LoadResourceFile(this.serverUtils.RESOURCE_NAME, "data/BadNames.json"))
    }

    public get blacklistedEntities(): number[] {
        return this.serverUtils.hasify(this.BlacklistedEntities);
    }

    public get blacklistedWeapons(): number[] {
        return this.serverUtils.hasify(this.BlacklistedWeapons);
    }

    public get whitelistedExplosions(): number[] {
        return this.WhitelistedExplosions;
    }

    public get whitelistedModels(): number[] {
        return this.serverUtils.hasify(this.WhitelistedModels);
    }

    public get blacklistedEvents(): string[] {
        return this.BlacklistedEvents
    }

    public get badWordsList(): string[] {
        return this.BadWordsList
    }

    public get badNameList(): string[] {
        return this.BadNameList
    }
}