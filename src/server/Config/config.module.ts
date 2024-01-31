import { Module } from "@public/core/decorators/module";
import { ConfigProvider } from "./config.provdier";
import { SettingsProvider } from "./settings.provider";


@Module({
    providers: [ConfigProvider, SettingsProvider]
})
export class ConfigModule { }