import { Module } from "@public/core/decorators/module";
import { PlayerConnection } from "./player.connect.provider";

@Module({
    providers: [PlayerConnection],
})
export class PlayerModule { }