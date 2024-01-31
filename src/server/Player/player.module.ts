import { Module } from "@public/core/decorators/module";
import { PlayerProvider } from "./playerConnect.provider";


@Module({
    providers: [PlayerProvider]
})
export class PlayerModule { }