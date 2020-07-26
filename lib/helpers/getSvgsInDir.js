"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getSvgsInDir;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getSvgsInDir(dir) {
  if (!_fs.default.existsSync(dir)) {
    return null;
  }

  return [].concat.apply([], _fs.default.readdirSync(dir).map(file => {
    const absolutePath = _path.default.join(dir, file);

    if (_fs.default.lstatSync(absolutePath).isDirectory()) {
      return getSvgsInDir(dir, file);
    }

    if (!absolutePath.match(/\.svg$/)) {
      return null;
    }

    return absolutePath;
  })).filter(filePath => filePath !== null);
}

module.exports = exports.default;