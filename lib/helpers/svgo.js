"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _svgo = _interopRequireDefault(require("svgo"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const svgo = new _svgo.default({
  plugins: ['removeDoctype', 'removeXMLProcInst', 'removeComments', 'removeMetadata', 'removeEditorsNSData', 'cleanupAttrs', 'convertStyleToAttrs', {
    'cleanupIDs': false
  }, 'removeRasterImages', 'removeUselessDefs', 'cleanupNumericValues', 'cleanupListOfValues', 'convertColors', 'removeUnknownsAndDefaults', 'removeNonInheritableGroupAttrs', 'removeUselessStrokeAndFill', 'removeViewBox', 'cleanupEnableBackground', 'removeHiddenElems', 'removeEmptyText', 'convertShapeToPath', 'moveElemsAttrsToGroup', 'moveGroupAttrsToElems', 'collapseGroups', 'convertPathData', 'convertTransform', 'removeEmptyAttrs', 'removeEmptyContainers', 'mergePaths', 'removeUnusedNS', 'transformsWithOnePath', 'sortAttrs', 'removeTitle', 'removeDesc', 'removeDimensions', 'addClassesToSVGElement', 'removeStyleElement', {
    removeAttrs: {
      attrs: 'class'
    }
  }]
});
var _default = svgo;
exports.default = _default;
module.exports = exports.default;