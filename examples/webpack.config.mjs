/**
 * This is an example webpack config file, that uses this plugin to compile icons.
 */
import path from 'path';
import SvgSpriteSheetPlugin from "svg-spritesheet-plugin";

export default {
    mode: "production",
    entry: {
        bundle: {import: "./src/index", dependOn: ["react"]},
        react: ["react", "react-dom"]
    },
    target: "web",
    output: {
        path: path.resolve('./dist'),
        filename: 'assets/[name]-[contenthash].js',
        assetModuleFilename: 'assets/[hash][ext][query]',
        publicPath: './'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|tsx|ts)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-typescript',
                        ['@babel/preset-react', {"runtime": "automatic"}]
                    ]
                }
            },
            {
                test: /\.svg$/i,
                use: ['svg-sprite-loader',
                    'svgo-loader']
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            }
        ]
    },
    plugins: [
        new SvgSpriteSheetPlugin()
    ]
};