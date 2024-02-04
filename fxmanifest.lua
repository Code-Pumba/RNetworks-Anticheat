fx_version("cerulean")
games({ "gta5" })

version("1.0.0")
author("rNetworks")
description("Anticheat for FiveM")

client_script({ "client.js", "build/client.js" })
server_script({ "server.js", "build/server.js" })

files({ "data/*", "config/config.json" })
