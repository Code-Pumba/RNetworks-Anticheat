import { Module } from "@public/core/decorators/module";
import { SystemCheckUpService } from "./System.checkUp.provider";


@Module({
    providers: [SystemCheckUpService]
})
export class SystemModule { }