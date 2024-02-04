import { On } from "@public/core/decorators/event";
import { Inject } from "@public/core/decorators/injectable";
import { Provider } from "@public/core/decorators/provider";
import { Logger } from "@public/core/logger";
import { ConfigProvider } from "@public/server/Config/config.provider";
import { BanController } from "@public/server/System/System.ban.controller";
import { GameEvents } from "@public/shared/Enums/gameEvents.enum";


@Provider()
export class EventClearPedTask {
    @Inject(ConfigProvider)
    private configProvider: ConfigProvider;

    @Inject(BanController)
    private banController: BanController;

    @Inject(Logger)
    private logger: Logger;

    @On(GameEvents.ClearPedTasksEvent, false)
    public onClearPedTask(source: string) {
        const module = "Anti-ClearTasks";
        if (this.configProvider.getModuleSetting(module).Enabled) {
            this.banController.Ban(source, module);
        }
    }
}