"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = minifySvg;

var _path = _interopRequireDefault(require("path"));

var _svgo = _interopRequireDefault(require("./svgo"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function minifySvg(file, content) {
  const svg = await _svgo.default.optimize(content);
  return {
    name: _path.default.basename(file, '.svg'),
    svg
  };
}

module.exports = exports.default;