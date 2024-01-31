export declare const rlife_base_is_client: boolean;
export declare const rlife_base_is_server: boolean;
export declare const rlife_base_is_production: boolean;
export declare let __dirname: string;
export declare let __filename: string;

if (rlife_base_is_server) {
    global.__dirname = process.cwd() + '/resources/[Store]/rNetworks-Anticheat/build';
    global.__filename = global.__dirname + '/server.js';

    if (!process.cwd().match(/rNetworks-Anticheat/)) {
        process.chdir('resources/[Store]/rNetworks-Anticheat');
    }
}