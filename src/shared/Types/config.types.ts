export interface Settings {

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