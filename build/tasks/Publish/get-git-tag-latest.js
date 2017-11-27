'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = getGitTagLatest;

var _normalisePackageName = require('./normalise-package-name');

function getGitTagLatest(pkg) {
  const gitpkgPackageName = `${(0, _normalisePackageName.normalisePackageNameNpm)(
    pkg.name
  )}-latest`;
  return gitpkgPackageName;
}
//# sourceMappingURL=get-git-tag-latest.js.map
