import { Injectable } from "@public/core/decorators/injectable";
import { PlayerIdentifier } from "@public/shared/Types/player.types";

@Injectable()
export class PlayerStateService {
    public getIdentifier(source: string, identifierType: string): string {
        return GetPlayerIdentifierByType(source, identifierType) ? GetPlayerIdentifierByType(source, identifierType) : "none";
    }

    public getPlayerToken(source: string, index: number = 0) {
        return GetPlayerToken(source, index);
    }

    public getAllIdentifier(source: string): PlayerIdentifier {
        return {
            FiveM: this.getIdentifier(source, "license") || "none",
            Steam: this.getIdentifier(source, "steam") || "none",
            Ip: this.getIdentifier(source, "ip") || "none",
            Discord: this.getIdentifier(source, "discord") || "none",
            Xbl: this.getIdentifier(source, "xbl") || "none",
            PlayerToken: this.getPlayerToken(source, 0) || "none",
            PlayerToken_2: this.getPlayerToken(source, 1) || "none"
        }
    }
}