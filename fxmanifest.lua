fx_version("cerulean")
games({ "gta5" })

version("0.0.1")

client_script({ "client.js", "build/client.js" })
server_script({ "server.js", "build/server.js" })

files({ "data/*", "config/config.json" })
