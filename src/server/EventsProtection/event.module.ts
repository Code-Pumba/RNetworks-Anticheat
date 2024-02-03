import { Module } from "@public/core/decorators/module";
import { EventWeaponDamage } from "./Events/WeaponDamage.event";
import { EventChatMessage } from "./Events/ChatMessage.event";
import { EventClearPedTask } from "./Events/ClearPedTask.event";


@Module({
    providers: [EventWeaponDamage, EventChatMessage, EventClearPedTask]
})
export class EventModule { }