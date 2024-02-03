import { Module } from "@public/core/decorators/module";
import { EventWeaponDamage } from "./Events/WeaponDamage.event";
import { EventChatMessage } from "./Events/ChatMessage.event";


@Module({
    providers: [EventWeaponDamage, EventChatMessage]
})
export class EventModule { }