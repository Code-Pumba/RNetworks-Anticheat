import { OnEvent } from "@public/core/decorators/event";
import { Inject } from "@public/core/decorators/injectable";
import { Provider } from "@public/core/decorators/provider";
import { Logger } from "@public/core/logger";

@Provider()
export class ApplicationClient {
    @Inject(Logger)
    private logger: Logger;

    @OnEvent("QBCore:Client:OnPlayerLoaded")
    public PlayerLoaded(): void {
        this.logger.info("Application wurde Erfolgreich gestartet")
    }
}