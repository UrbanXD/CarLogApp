const {getDefaultConfig} = require('expo/metro-config');

const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

config.resolver.unstable_enablePackageExports = false;
module.exports = config;