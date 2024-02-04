export interface Settings {
    Debug: boolean;
    'Connect-Settings': {
        'VPN-Check': boolean;
        'Name-Filter': boolean;
    };
    Identifier: string;
}

export interface Addons {
    [key: string]: any;
}

export interface Module {
    Enabled: boolean;
    Action: string;
    Message: string;
    Duration: number;
    Addons: Addons;
}

export interface Modules {
    [key: string]: Module;
}

export interface Config {
    Settings: Settings;
    Modules: Modules;
}