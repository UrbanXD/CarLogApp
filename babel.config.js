module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'react-native-paper/babel'
      ],
      '@babel/plugin-transform-async-generator-functions'

      // // NOTE: this is only necessary if you are using reanimated for animations
      // 'react-native-reanimated/plugin',
    ],
  };
};
