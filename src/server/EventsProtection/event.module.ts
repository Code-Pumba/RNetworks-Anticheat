import { Module } from "@public/core/decorators/module";
import { EventWeaponDamage } from "./Events/WeaponDamage.event";


@Module({
    providers: [EventWeaponDamage]
})
export class EventModule { }