import fs from 'fs';
import getSvsgInDir from './helpers/getSvgsInDir';
import minifySvg from './helpers/minifySvg';
import nunjucks from 'nunjucks';
import path from 'path';
import { cleanupName, cleanupNativeSvg, cleanupSvg } from './helpers/cleanup';
nunjucks.configure({ autoescape: false });

const defaultComment = 'Presented by https://rumanbsl@github.com - do not modify manually';
const defaultComponentName = 'Icon';

export default async function configureGenerator(config) {
  return async () => {
    const componentName = config.componentName || defaultComponentName;
    const defaultTemplate = ((c) => {
      if (c.native) {
        if (c.tsx) {
          return path.join(__dirname, '..', 'template', 'icon_native.tsx.nunjucks')
        } else {
          return path.join(__dirname, '..', 'template', 'icon_native.nunjucks')
        }
      } else {
        if (c.tsx) {
          return path.join(__dirname, '..', 'template', 'icon-tsx.nunjucks')
        } else {
          return path.join(__dirname, '..', 'template', 'icon.nunjucks')
        }
      }
    })(config);
    const template = config.template || defaultTemplate;
    const templateFile = path.isAbsolute(template)
      ? template
      : path.join(process.cwd(), template);
    const templateContent = fs.readFileSync(templateFile).toString();

    const svgDir = path.isAbsolute(config.svgDir)
      ? config.svgDir
      : path.join(process.cwd(), config.svgDir);

    console.log('Looking for SVGs in:', svgDir); // eslint-disable-line no-console

    console.log(`Using ${componentName} template from:`, templateFile); // eslint-disable-line no-console

    const svgs = getSvsgInDir(svgDir);

    const iconDestination = config.destination || path.join(process.cwd(), 'Icon.react.js');

    const comment = config.comment || defaultComment;
    const reactPureRender = config.reactPureRender;
    const cleanupHelper = config.native ? cleanupNativeSvg : cleanupSvg;

    const svgPromises = svgs.map(file => minifySvg(file, fs.readFileSync(file).toString()));
    await Promise.all(svgPromises).then(results => {
      const icons = results.map(result => {
        const extractedWidth = (() => {
          const arr = result.svg.data
            .substring(result.svg.data.indexOf("<svg"), result.svg.data.indexOf(">"))
            .match(/width=\"?\'?[0-9]+[A-Za-z0-9]+?"/);
          if (Array.isArray(arr) && arr.length > 0) {
            return arr[0].replace("width=\"", "").replace("\"", "")
          }
          return ""
        })()
        const extractedHeight = (() => {
          const arr = result.svg.data
            .substring(result.svg.data.indexOf("<svg"), result.svg.data.indexOf(">"))
            .match(/height=\"?\'?[0-9]+[A-Za-z0-9]+?"/);
          if (Array.isArray(arr) && arr.length > 0) {
            return arr[0].replace("height=\"", "").replace("\"", "")
          }
          return ""
        })();
        console.log({ extractedHeight, extractedWidth })
        return {
          name: cleanupName(result.name),
          svg: cleanupHelper(result.svg.data, config.keepFillColor, extractedWidth, extractedHeight),
          extractedWidth,
          extractedHeight,
        };
      }).sort((a, b) => a.name.localeCompare(b.name));

      fs.writeFileSync(
        iconDestination,
        nunjucks.renderString(templateContent, {
          icons,
          comment,
          reactPureRender,
          useColorProp: !config.keepFillColor,
          componentName
        })
      );

      if (config.verbose) {
        console.log(`Generated ${componentName} component to:`, iconDestination); // eslint-disable-line no-console
        console.log(icons.map(icon => `<${componentName} kind="${icon.name}" />`).join('\n')); // eslint-disable-line no-console
      }
    }).catch(error => console.error(error)); // eslint-disable-line no-console
  };
}
