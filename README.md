# svg-spritesheet-plugin
[![npm](https://img.shields.io/npm/v/svg-spritesheet-plugin.svg)](https://www.npmjs.com/package/svg-spritesheet-plugin)

A Webpack plugin to compile separate SVG files into a single spreadsheet. Works in watch mode as well, will recompile when the icons folder changes.

This plugin looks in the icons directory (default: `./icons/`), and compiles the found icon files into a single file (default: `./src/components/common/IconType.ts`). This file looks like this:
```ts
import "../../../icons/moon.svg";
import "../../../icons/pencil.svg";
import "../../../icons/plus.svg";
import "../../../icons/sun.svg";

type IconType = "moon"
    | "pencil"
    | "plus"
    | "sun";
export default IconType;
export function loadSvgIcons(){/*dummy function*/}
```
The dummy function is needed, as just importing the file does not generate the files for some reason. (If this bug is fixed, then the dummy function will not be needed).
This plugin uses [svg-sprite-loader](https://github.com/JetBrains/svg-sprite-loader/) internally for compiling the icons into a spritesheet, and for using them at runtime.


## Installation
Download the package with your package manager of your choice. Here is an example with NPM:
```sh
npm install -D svg-spritesheet-plugin
```

## Usage
First off, add a rule for SVG files in `webpack.config.js`:
```js
module.exports = {
    module: {
        rules: [
            ...
            {
                test: /\.svg$/i,
                use: ['svg-sprite-loader',
                    'svgo-loader']
            },
            ...
        ]
    }
}
```
Then, add the plugin in the same webpack config:
```js
module.exports = {
    plugins: [
        ...
        new SvgSpriteSheetPlugin(),
        ...
    ]
}
```
Or, optionally, add configuration options:
```js
module.exports = {
    plugins: [
        ...
        new SvgSpriteSheetPlugin({
            iconsDir: "./static/icons"
        }),
        ...
    ]
}
```

Then, **run webpack** to ensure that the file exists, and then add the following lines into your entrypoint (for example, `index.ts`):
```ts
import {loadSvgIcons} from "./components/common/IconType";

loadSvgIcons();
```



## Configuration
The plugin can be configured by passing an object in the constructor with the following values:
- `iconsDir`: Path of the file to generate that exports the icon types. Defaults to `"./icons"`
- `iconTypeFile`: Path of the file to generate that exports the icon types. Defaults to `."/src/components/common/IconType.ts"`
- `spriteLoaderOptions`: Options to pass to the internal SVGSpriteLoaderPlugin instance. Defaults to `{ plainSprite: true }`

## Examples
See the [examples folder](examples) for example/related usage.
