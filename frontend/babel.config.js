module.exports = function (api) {
   api.cache(true);
   return {
      presets: ['babel-preset-expo'],
      plugins: [
         '@babel/plugin-transform-async-generator-functions',
         'react-native-reanimated/plugin',
         [
            'module:react-native-dotenv',
            {
               envName: 'APP_ENV',
               moduleName: '@env',
               path: '../.env',
               safe: false,
               allowUndefined: false,
            }
         ],
      ],
   };
};
