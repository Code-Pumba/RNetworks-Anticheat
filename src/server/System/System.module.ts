import { Module } from "@public/core/decorators/module";
import { SystemCheckUpService } from "./System.checkUp.provider";
import { BanController } from "./System.ban.controller";


@Module({
    providers: [SystemCheckUpService, BanController]
})
export class SystemModule { }