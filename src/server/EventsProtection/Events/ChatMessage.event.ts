import { On, Once } from "@public/core/decorators/event";
import { Inject } from "@public/core/decorators/injectable";
import { Provider } from "@public/core/decorators/provider";
import { Logger } from "@public/core/logger";
import { ConfigProvider } from "@public/server/Config/config.provider";
import { BanController } from "@public/server/System/System.ban.controller";
import { GameEvents } from "@public/shared/Enums/gameEvents.enum";


@Provider()
export class EventChatMessage {

    @Inject(ConfigProvider)
    private configProvider: ConfigProvider;

    @Inject(Logger)
    private logger: Logger;

    @Inject(BanController)
    private banController: BanController;

    private badWordlist: Set<string> = new Set();

    @Once()
    public async Init(): Promise<void> {
        this.badWordlist = new Set(this.configProvider.badWordsList);
    }

    @On(GameEvents.ChatMessage, false)
    public async onChatMessage(source: string, _: string, message: string): Promise<void> {
        const module = "Chat-Message-Profane"
        const _moduleSetting = this.configProvider.getModuleSetting(module);
        if (!_moduleSetting.Enabled) return;

        const firstChar = message[0]
        if (message.length > 0 && firstChar === "!" || firstChar === "/" || firstChar === "@") {
            this.logger.error(`[Chat-Message-Profane] ${source} tried to use a profane word: ${message}`);
            CancelEvent()
        } else if (this.badWordlist.has(message)) {
            this.banController.Ban(source, module);
        }
    }

}