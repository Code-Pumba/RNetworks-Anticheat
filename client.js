const hotReload = GetConvar("rlife_core_hot_reload", "false") == "true";

if (hotReload) {
    console.log("[rLife-Core] hot module reload enabled");
    onNet("rlife_core:__development__:hot-reload", (content) => {
        console.log("[rlife_core] [hmr] reloading client file");
        emit("rlife_core.__internal__.stop_application");

        eval(content);
    });

    setTimeout(() => {
        SendNuiMessage(
            JSON.stringify({
                type: "rlife_core-nui-load",
                mode: "dev",
            })
        );
    }, 1000);
} else {
    setTimeout(() => {
        SendNuiMessage(
            JSON.stringify({
                type: "rlife_core-nui-load",
                mode: "production",
            })
        );
    }, 1000);
}
