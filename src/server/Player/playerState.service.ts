import { Inject, Injectable } from "@public/core/decorators/injectable";
import { Logger } from "@public/core/logger";
import { Ban } from "@public/shared/Types/Ban.types";


@Injectable()
export class PlayerStateService {
    @Inject(Logger)
    private logger: Logger;

    public getCredentials(source: number): Ban {
        try {
            const Identifier = {
                Steam: GetPlayerIdentifierByType(source, "steam"),
                FiveM: GetPlayerIdentifierByType(source, "license"),
                Discord: GetPlayerIdentifierByType(source, "discord"),
                Token: GetPlayerToken(source, 0),
                Token_2: GetPlayerToken(source, GetNumPlayerTokens(source)),
            }
            this.logger.debug(JSON.stringify(Identifier))
            return Identifier
        } catch (error) {
            this.logger.error(error)
        }
    }
}