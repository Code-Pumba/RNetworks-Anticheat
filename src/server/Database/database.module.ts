import { Module } from "@core/decorators/module";
import { DatabaseProvider } from "./database.provider";


@Module({
    providers: [DatabaseProvider]
})
export class DatabaseModule { }