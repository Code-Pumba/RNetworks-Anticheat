import { Module } from "@public/core/decorators/module";
import { EventProtection } from "./eventProtection.provider";


@Module({
    providers: [EventProtection]
})
export class EventProtectionModule { }