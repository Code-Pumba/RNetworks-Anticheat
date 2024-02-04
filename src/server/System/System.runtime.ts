import { Once } from "@public/core/decorators/event";
import { Inject } from "@public/core/decorators/injectable";
import { Provider } from "@public/core/decorators/provider";
import { Logger } from "@public/core/logger";
import { Utils } from "@public/shared/utils";


@Provider()
export class SystemRuntime {

    @Inject(Logger)
    private logger: Logger;

    @Inject(Utils)
    private utils: Utils;

    private runtimeId: string;

    @Once()
    public async Init(): Promise<void> {
        this.runtimeId = this.utils.generateInternalUUID();
    }

    public getRuntimeId(): string {
        return this.runtimeId;
    }
}