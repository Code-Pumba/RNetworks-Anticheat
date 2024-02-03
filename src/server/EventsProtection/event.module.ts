import { Module } from "@public/core/decorators/module";
import { EventWeaponDamage } from "./Events/WeaponDamage.event";
import { EventChatMessage } from "./Events/ChatMessage.event";
import { EventClearPedTask } from "./Events/ClearPedTask.event";
import { EventGiveWeapon } from "./Events/GiveWeapon.event";
import { EventFire } from "./Events/Fire.event";
import { EventExplosion } from "./Events/Explosion.event";


@Module({
    providers: [EventWeaponDamage, EventChatMessage, EventClearPedTask, EventChatMessage, EventGiveWeapon, EventFire, EventExplosion]
})
export class EventModule { }