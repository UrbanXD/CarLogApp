const {getDefaultConfig} = require('expo/metro-config');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// PowerSync Web publishes a Metro-compatible UMD entry point and worker assets.
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionsByPlatform.web ??= [];
if (!config.resolver.unstable_conditionsByPlatform.web.includes('react-native-web')) {
  config.resolver.unstable_conditionsByPlatform.web.push('react-native-web');
}

// Keep native resolution unchanged, but ensure web never picks up React Native's
// native entry point when a dependency imports the bare `react-native` package.
const upstreamResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === 'react-native') {
    return context.resolveRequest(context, 'react-native-web', platform);
  }

  return upstreamResolveRequest
    ? upstreamResolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
