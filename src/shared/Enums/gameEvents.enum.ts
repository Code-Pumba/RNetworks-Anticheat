export enum GameEvents {
    WeaponDamageEvent = "weaponDamageEvent", // @Params source: number, data: WeaponDamageEvent
    ChatMessage = "chatMessage", // @Params source: number, message: string
    ClearPedTasksEvent = "clearPedTasksEvent", // @Params source: number
    PlayerConnecting = "playerConnecting", // @Params name: string, setKickReason | _: => void, deferrals: Deferrals
    EntityCreated = "entityCreated", // @Params entity: number
    ExplosionEvent = "explosionEvent", // @Params source: number, data: ExplosionEvent
    FireEvent = "fireEvent", // @Params source: number, data: any
    GiveWeaponEvent = "giveWeaponEvent", // @Params source: number, data: GiveWeaponEvent
    PtFxEvebt = "ptFxEvent", // @Params source: number, data: PtFxEvent
    PlayerEnteredScope = "playerEnteredScope", // @Params data: any
    PlayerLeftScope = "playerLeftScope", // @Params data: any
    RemoveWeaponsEvent = "removeWeaponsEvent", // @Params source: number, data: RemoveWeaponsEvent
    RemoveAllWeaponsEvent = "removeAllWeaponsEvent", // @Params source: number data: RemoveAllWeaponsEvent
    StartProjectileEvent = "startProjectileEvent", // @Params source: number, data: StartProjectileEvent
}