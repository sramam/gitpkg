'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _execLikeShell = require('./exec-like-shell');

var _execLikeShell2 = _interopRequireDefault(_execLikeShell);

var _getTempDir = require('./get-temp-dir');

var _getTempDir2 = _interopRequireDefault(_getTempDir);

var _getGitTagName = require('./get-git-tag-name');

var _getGitTagName2 = _interopRequireDefault(_getGitTagName);

var _getGitTagLatest = require('./get-git-tag-latest');

var _getGitTagLatest2 = _interopRequireDefault(_getGitTagLatest);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports.default = async function uploadPackage(pkg, pkgPath, registry) {
  const pkgTempDir = await (0, _getTempDir2.default)(pkg);
  const pkgTempDirPkg = _path2.default.join(pkgTempDir, 'package');
  const gitpkgPackageName = (0, _getGitTagName2.default)(pkg);
  const gitTagLatest = (0, _getGitTagLatest2.default)(pkg);
  await (0, _execLikeShell2.default)('git init', pkgTempDirPkg);
  await (0, _execLikeShell2.default)('git add .', pkgTempDirPkg);
  await (0, _execLikeShell2.default)('git commit -m gitpkg', pkgTempDirPkg);
  await (0, _execLikeShell2.default)(`git remote add origin ${registry}`, pkgTempDirPkg);
  await (0, _execLikeShell2.default)(`git tag ${gitpkgPackageName}`, pkgTempDirPkg);
  try {
    await (0, _execLikeShell2.default)(`git push origin ${gitpkgPackageName}`, pkgTempDirPkg);
  } catch (err) {
    const gitErrorExists = 'Updates were rejected because the tag already exists in the remote.';
    const exists = err.stderr.indexOf(gitErrorExists) > -1;
    if (exists) {
      throw new Error(`The git tag "${gitpkgPackageName}" already exists in "${registry}".`);
    }
    throw err;
  }
  // move 'latest' tag for module ${gitTagLatest} to current setting
  try {
    await (0, _execLikeShell2.default)(`git push --delete origin ${gitTagLatest}`, pkgTempDirPkg);
  } catch (err) {
    const msg = /unable to delete '.*': remote ref does not exist/;
    if (!err.stderr.match(msg)) {
      throw err; // unknown error, bubble up
    }
  }
  await (0, _execLikeShell2.default)(`git tag ${gitTagLatest}`, pkgTempDirPkg);
  await (0, _execLikeShell2.default)(`git push --tags`, pkgTempDirPkg);
};
//# sourceMappingURL=upload-package.js.map
