import { Module } from "@public/core/decorators/module";
import { ConfigProvider } from "./config.provider";

@Module({
    providers: [ConfigProvider]
})
export class ConfigModule { }