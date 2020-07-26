"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configureGenerator;

var _fs = _interopRequireDefault(require("fs"));

var _getSvgsInDir = _interopRequireDefault(require("./helpers/getSvgsInDir"));

var _minifySvg = _interopRequireDefault(require("./helpers/minifySvg"));

var _nunjucks = _interopRequireDefault(require("nunjucks"));

var _path = _interopRequireDefault(require("path"));

var _cleanup = require("./helpers/cleanup");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_nunjucks.default.configure({
  autoescape: false
});

const defaultComment = 'Presented by https://rumanbsl@github.com - do not modify manually';
const defaultComponentName = 'Icon';

async function configureGenerator(config) {
  return async () => {
    const componentName = config.componentName || defaultComponentName;

    const defaultTemplate = (c => {
      if (c.native) {
        if (c.tsx) {
          return _path.default.join(__dirname, '..', 'template', 'icon_native.tsx.nunjucks');
        } else {
          return _path.default.join(__dirname, '..', 'template', 'icon_native.nunjucks');
        }
      } else {
        if (c.tsx) {
          return _path.default.join(__dirname, '..', 'template', 'icon-tsx.nunjucks');
        } else {
          return _path.default.join(__dirname, '..', 'template', 'icon.nunjucks');
        }
      }
    })(config);

    const template = config.template || defaultTemplate;
    const templateFile = _path.default.isAbsolute(template) ? template : _path.default.join(process.cwd(), template);

    const templateContent = _fs.default.readFileSync(templateFile).toString();

    const svgDir = _path.default.isAbsolute(config.svgDir) ? config.svgDir : _path.default.join(process.cwd(), config.svgDir);
    console.log('Looking for SVGs in:', svgDir); // eslint-disable-line no-console

    console.log(`Using ${componentName} template from:`, templateFile); // eslint-disable-line no-console

    const svgs = (0, _getSvgsInDir.default)(svgDir);

    const iconDestination = config.destination || _path.default.join(process.cwd(), 'Icon.react.js');

    const comment = config.comment || defaultComment;
    const reactPureRender = config.reactPureRender;
    const cleanupHelper = config.native ? _cleanup.cleanupNativeSvg : _cleanup.cleanupSvg;
    const svgPromises = svgs.map(file => (0, _minifySvg.default)(file, _fs.default.readFileSync(file).toString()));
    await Promise.all(svgPromises).then(results => {
      const icons = results.map(result => {
        const extractedWidth = (() => {
          const arr = result.svg.data.substring(result.svg.data.indexOf("<svg"), result.svg.data.indexOf(">")).match(/width=\"?\'?[0-9]+[A-Za-z0-9]+?"/);

          if (Array.isArray(arr) && arr.length > 0) {
            return arr[0].replace("width=\"", "").replace("\"", "");
          }

          return "";
        })();

        const extractedHeight = (() => {
          const arr = result.svg.data.substring(result.svg.data.indexOf("<svg"), result.svg.data.indexOf(">")).match(/height=\"?\'?[0-9]+[A-Za-z0-9]+?"/);

          if (Array.isArray(arr) && arr.length > 0) {
            return arr[0].replace("height=\"", "").replace("\"", "");
          }

          return "";
        })();

        console.log({
          extractedHeight,
          extractedWidth
        });
        return {
          name: (0, _cleanup.cleanupName)(result.name),
          svg: cleanupHelper(result.svg.data, config.keepFillColor, extractedWidth, extractedHeight),
          extractedWidth,
          extractedHeight
        };
      }).sort((a, b) => a.name.localeCompare(b.name));

      _fs.default.writeFileSync(iconDestination, _nunjucks.default.renderString(templateContent, {
        icons,
        comment,
        reactPureRender,
        useColorProp: !config.keepFillColor,
        componentName
      }));

      if (config.verbose) {
        console.log(`Generated ${componentName} component to:`, iconDestination); // eslint-disable-line no-console

        console.log(icons.map(icon => `<${componentName} kind="${icon.name}" />`).join('\n')); // eslint-disable-line no-console
      }
    }).catch(error => console.error(error)); // eslint-disable-line no-console
  };
}

module.exports = exports.default;