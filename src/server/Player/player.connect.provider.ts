import { On, OnEvent, Once } from "@public/core/decorators/event";
import { Inject } from "@public/core/decorators/injectable";
import { Provider } from "@public/core/decorators/provider";
import { GameEvents } from "@public/shared/Enums/gameEvents.enum";
import { Deferrals } from "@public/shared/Types/Events";
import { PlayerStateService } from "./player.state.service";
import { Logger } from "@public/core/logger";
import { ConfigProvider } from "../Config/config.provider";
import { wait } from "@public/core/utils";
import { Utils } from "@public/shared/utils";


@Provider()
export class PlayerConnection {

    @Inject(PlayerStateService)
    private playerStateService: PlayerStateService;

    @Inject(Logger)
    private logger: Logger;

    @Inject(ConfigProvider)
    private config: ConfigProvider;

    @Inject(Utils)
    private utils: Utils;

    private badNames: Set<string> = new Set();

    @Once()
    public init(): void {
        this.badNames = new Set(this.config.badNameList);
    }

    @On(GameEvents.PlayerConnecting, false)
    public async onPlayerConnecting(name: string, setKickReason: (reason: string) => void, deferrals: Deferrals) {
        const _source = source;
        const _identifier = this.playerStateService.getAllIdentifier(_source.toString());
        const mainIdentifier = this.config.getSettings().Identifier;
        const ENV_Mode = this.config.getSettings().Debug;
        const connectSettings = this.config.getSettings()["Connect-Settings"];
        const Ip = _identifier.Ip.slice(3)

        deferrals.defer()
        await wait(0)

        this.logger.debug(`User with the name - ${name} - is connecting to the Server`)

        //! Main Identifier Check
        if (mainIdentifier === "steam") {
            if (_identifier.Steam === "none") {
                deferrals.done("Steam was not Found, please start Steam and restart your game!")
                this.logger.debug(`Steam for the User - ${name} - was not Found`)
            }
        } else if (mainIdentifier === "license") {
            if (_identifier.FiveM === "none") {
                deferrals.done("License was not Found, please restart your game!")
                this.logger.debug(`License for the User - ${name} - was not Found`)
            }
        }

        //! Ban Check

        //! Name Filter
        if (connectSettings["Name-Filter"]) {
            if (!this.utils.isAlphaNumeric(name)) {
                deferrals.done("Your name contains Illegal Characters, please remove them and restart your client.")
                this.logger.debug(`User with the Identifier ${_identifier.Steam || _identifier.FiveM} - ${name} - contains Illegal Characters`)
            }
            if (this.badNames.has(name)) {
                deferrals.done("Your name contains a Bad Word, please remove it and restart your client.")
                this.logger.debug(`User with the Identifier ${_identifier.Steam || _identifier.FiveM} - ${name} - contains Illegal Names`)
            }
        }

        //! VPN Check
        if (!ENV_Mode) {
            if (connectSettings["VPN-Check"]) {
                if (await this.utils.isUsingVpn(Ip)) {
                    deferrals.done("You are using a VPN, please disable it and restart your client.")
                    this.logger.debug(`User with the Identifier ${_identifier.Steam || _identifier.FiveM} - ${name} - has VPN enabled`)
                }
            }
        }

        deferrals.done();
    }

}