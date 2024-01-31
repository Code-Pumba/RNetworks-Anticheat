const path = require("path");
const ESLintPlugin = require("eslint-webpack-plugin");
const webpack = require("webpack");
const fs = require("fs");

const createConfig = (
    entry,
    isProduction,
    variables = {},
    target = undefined
) => {
    const plugins = [
        new ESLintPlugin(),
        new webpack.DefinePlugin({
            ...variables,
            rlife_base_is_production: isProduction,
        }),
    ];

    return {
        target: target,
        entry,
        output: {
            filename: "[name].js",
            path: path.resolve(__dirname, "build"),
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".json"],
        },
        plugins,
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "swc-loader",
                        options: {
                            jsc: {
                                parser: {
                                    syntax: "typescript",
                                    tsx: true,
                                    decorators: true,
                                },
                                target: "es2020",
                                transform: {
                                    react: {
                                        runtime: "automatic",
                                        development: !isProduction,
                                        refresh: !isProduction,
                                    },
                                    optimizer: {
                                        simplify: true,
                                        globals: {
                                            vars: {
                                                ...variables,
                                                rlife_base_is_production:
                                                    JSON.stringify(
                                                        isProduction
                                                    ),
                                            },
                                        },
                                    },
                                },
                                keepClassNames: true,
                                baseUrl: ".",
                                paths: {
                                    "@public/*": ["src/*"],
                                    "@core/*": ["src/core/*"],
                                },
                            },
                            sourceMaps: !isProduction,
                            minify: isProduction,
                        },
                    },
                },
            ],
        },
    };
};

module.exports = { createConfig };
