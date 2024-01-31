const hmr = require("./src/hmr.js");
const hotReload = GetConvar("rlife_core_hot_reload", "false") == "true";

if (hotReload) {
    console.log("[rlife_core] hot module reload enabled");

    hmr.hmr("build/server.js", (newContent) => {
        console.log("[rlife_core] hmr: reloading dist/server.js");
        emit("rlife_core.__internal__.stop_application");

        eval(newContent);
    });

    hmr.hmr("build/client.js", (newContent) => {
        console.log("[rlife_core] hmr: reloading dist/client.js");

        emitNet("rlife_core:__development__:hot-reload", -1, newContent);
    });
}
