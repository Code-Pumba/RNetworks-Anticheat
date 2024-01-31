export type Ban = {
    id: number;
    Steam: string;
    FiveM: string;
    Discord: string;
    Token: string;
    Token_2: string;
    Reason: string;
    Duration: string;
}

// BanInterface.ts
export interface BanInterface {
    id: number;
    Steam: string;
    FiveM: string;
    Discord: string;
    Token: string;
    Token_2: string;
    Reason: string;
    Duration: string;
}

export class BanModel implements BanInterface {
    id: number;
    Steam: string;
    FiveM: string;
    Discord: string;
    Token: string;
    Token_2: string;
    Reason: string;
    Duration: string;

    // Array der Spaltennamen
    static columns: string[] = [
        'Id',
        'Steam',
        'FiveM',
        'Discord',
        'Token',
        'Token_2',
        'Reason',
        'Duration'
    ];

    constructor(data: BanInterface) {
        this.id = data.id;
        this.Steam = data.Steam;
        this.FiveM = data.FiveM;
        this.Discord = data.Discord;
        this.Token = data.Token;
        this.Token_2 = data.Token_2;
        this.Reason = data.Reason;
        this.Duration = data.Duration;
    }
}