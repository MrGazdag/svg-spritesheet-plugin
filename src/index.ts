import fs from "fs";
import path from "path";
import { Compiler, Compilation } from "webpack";
import SVGSpriteLoaderPlugin from "svg-sprite-loader/plugin.js";

interface SvgSpriteSheetPluginOptions {
    /**
     * Folder where the SVG icons reside.
     * Defaults to "./icons"
     */
    iconsDir?: string;
    /**
     * Path of the file to generate that exports the icon types.
     * Defaults to "./src/components/common/IconType.ts"
     */
    iconTypeFile?: string;
    /**
     * Options to pass to the internal SVGSpriteLoaderPlugin instance.
     */
    spriteLoaderOptions?: SVGSpriteLoaderPlugin.Options;
}

class SvgSpriteSheetPlugin {
    private options: Required<SvgSpriteSheetPluginOptions>;
    private spriteLoaderPlugin: SVGSpriteLoaderPlugin;

    constructor(options: SvgSpriteSheetPluginOptions = {}) {
        this.options = {
            iconsDir: options.iconsDir || "./icons",
            iconTypeFile: options.iconTypeFile || "./src/components/common/IconType.ts",
            spriteLoaderOptions: options.spriteLoaderOptions || { plainSprite: true },
        };
        this.spriteLoaderPlugin = new SVGSpriteLoaderPlugin(this.options.spriteLoaderOptions);
    }

    apply(compiler: Compiler) {
        // Run SVGSpriteLoaderPlugin first
        // The "any" cast is required here, as
        // @types/svg-sprite-loader depends on webpack@4.0.0,
        // which results in type errors
        this.spriteLoaderPlugin.apply(compiler as any);

        compiler.hooks.thisCompilation.tap("SvgIconCompilerPlugin", (compilation) => {
            let iconsDirAbs = path.resolve(compiler.context, this.options.iconsDir);
            let iconTypeAbs = path.resolve(compiler.context, this.options.iconTypeFile);

            // Make Webpack watch the folder for changes
            compilation.contextDependencies.add(iconsDirAbs);

            // Generate IconType file
            compilation.hooks.processAssets.tap(
                {
                    name: "SvgIconCompilerPlugin",
                    stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
                },
                () => {
                    SvgSpriteSheetPlugin.generateIconTypeFile(iconsDirAbs, iconTypeAbs);
                }
            );
        });
    }

    /**
     * Reads the SVG icons in the provided directory (recursively),
     * generates the content for IconType.ts and writes it to disk.
     *
     * @param iconsDirAbs absolute path to the "icons" directory
     * @param iconTypeAbs absolute path to the "IconType" file
     */
    public static generateIconTypeFile(iconsDirAbs: string, iconTypeAbs: string) {
        let icons: string[] = [];
        for (let file of fs.readdirSync(iconsDirAbs, {recursive: true, withFileTypes: true})) {
            if (file.name.endsWith(".svg")) {
                icons.push(file.name.substring(0, file.name.length-".svg".length));
            }
        }

        let relativePrefix = path.relative(path.dirname(iconTypeAbs), iconsDirAbs).replace(/\\/g, "/");
        if (!relativePrefix.startsWith(".")) relativePrefix = "./" + relativePrefix;

        const imports = icons.map((i) => `import "${relativePrefix}/${i}.svg";`).join("\n");
        const iconTypes = icons.map((i) => `"${i}"`).join("\n    | ");
        const newContents = `${imports}

type IconType = ${iconTypes};
export default IconType;
export function loadSvgIcons(){/*dummy function*/}`;

        let oldContents: string | null = null;
        try {
            oldContents = fs.readFileSync(iconTypeAbs, "utf8");
        } catch {
            // File doesn’t exist yet
        }
        if (oldContents != newContents) {
            // Ensure directory exists
            fs.mkdirSync(path.dirname(iconTypeAbs), { recursive: true });
            fs.writeFileSync(iconTypeAbs, newContents, { encoding: "utf8" });
        }
    }
}
export = SvgSpriteSheetPlugin;
