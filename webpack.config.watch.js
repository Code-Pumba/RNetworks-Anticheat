const { createConfig } = require("./webpack.config.base");
const path = require("path");

module.exports = (env, argv) => {
    const buildPath = path.resolve(__dirname, "build");
    const clientConfig = createConfig(
        { client: "./src/client.ts" },
        argv.mode === "production",
        { rlife_base_is_server: "false", rlife_base_is_client: "true" },
        "node"
    );

    const serverConfig = createConfig(
        { server: "./src/server.ts" },
        argv.mode === "production",
        {
            rlife_base_is_server: "true",
            rlife_base_is_client: "false",
            __dirname: '"' + buildPath + '"',
        },
        "node"
    );

    return [clientConfig, serverConfig];
};
