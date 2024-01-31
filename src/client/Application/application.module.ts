import { Module } from "@public/core/decorators/module";

import { ApplicationClient } from "./application.provider";
@Module({
    providers: [ApplicationClient]
})
export class ApplicationModule { }