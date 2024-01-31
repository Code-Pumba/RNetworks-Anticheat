import { Provider } from "@public/core/decorators/provider";
import { Inject } from "@public/core/decorators/injectable";
import { OnEvent, Once, OnceStep } from "@public/core/decorators/event";
import { Logger } from "@public/core/logger";
import { CheckupService } from "./application.checkup";
import { ServerUtils } from "../serverUtils";
import { SettingsProvider } from "../Config/settings.provider";


@Provider()
export class ApplicationProvider {

    @Inject(Logger)
    private logger: Logger;

    @Inject(CheckupService)
    private checkupService: CheckupService;

    @Inject(ServerUtils)
    private serverUtils: ServerUtils

    @Inject(SettingsProvider)
    private settingsProvider: SettingsProvider;

    @Once()
    public async InitApp(): Promise<void> {
        this.logger.info("Application Started");
        this.CheckServerConvars()
        this.CheckServer()
    }

    @Once(OnceStep.DatabaseConnected)
    public async DatabaseCheckup(): Promise<void> {
        await this.checkupService.Init()
    }

    private async CheckServer(): Promise<void> {
        const _version = GetResourceMetadata(this.serverUtils.RESOURCE_NAME, "version", 0);
        if (_version !== this.serverUtils.CURRENT_VERSION) { //! SPÄTER API CALL
            this.logger.warn(`Resource ${this.serverUtils.RESOURCE_NAME} is outdated!`);
        } else {
            this.logger.info(`Resource ${this.serverUtils.RESOURCE_NAME} is up to date!`);
        }
        const _resourceName = GetCurrentResourceName()
        if (_resourceName !== this.serverUtils.RESOURCE_NAME) {
            this.logger.warn(`Resource name is not ${this.serverUtils.RESOURCE_NAME} this could lead to Serious Errors!`);
        } else {
            this.logger.info(`Current Resource Name is Correct: - ${this.serverUtils.RESOURCE_NAME}!`);
        }
    }

    private async CheckServerConvars(): Promise<void> {
        const convars = [
            { name: "onesync", recommendedValue: "on" },
            { name: "sv_scriptHookAllowed", recommendedValue: "false" },
            { name: "sv_enableNetworkedPhoneExplosions", recommendedValue: "false" },
            { name: "sv_enableNetworkedSounds", recommendedValue: "false" },
            { name: "sv_enforceGameBuild", recommendedValue: "2944" },
        ];

        for (const convar of convars) {
            const convarValue = GetConvar(convar.name, "");
            if (convarValue !== convar.recommendedValue) {
                this.logger.warn(`Convar ${convar.name} is not set to ${convar.recommendedValue} this could lead to Serious Errors!`);
            }
        }
    }
}