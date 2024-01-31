import { Inject, Injectable } from "@public/core/decorators/injectable";
import { Logger } from "@public/core/logger";
import { Ban } from "@public/shared/Types/Ban.types";


@Injectable()
export class PlayerStateService {
    @Inject(Logger)
    private logger: Logger;

    public getIdentifiers(source: number): Ban {
        return {
            Steam: GetPlayerIdentifierByType(source.toString(), "steam"),
            FiveM: GetPlayerIdentifierByType(source.toString(), "license"),
            Discord: GetPlayerIdentifierByType(source.toString(), "discord"),
            Token: GetPlayerToken(source.toString(), 0),
            Token_2: GetPlayerToken(source.toString(), GetNumPlayerTokens(source.toString())),
        }
    }
}