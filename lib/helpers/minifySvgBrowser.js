"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = minifySvg;

var _path = _interopRequireDefault(require("path"));

var _svgoBrowser = _interopRequireDefault(require("./svgoBrowser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const svgo = new _svgoBrowser.default();

function minifySvg(file, content) {
  return new Promise(resolve => svgo.optimize(content, result => resolve({
    filename: file,
    name: _path.default.basename(file, '.svg'),
    svg: result
  })));
}

module.exports = exports.default;