const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude backend directory from Metro bundler watch and bundling
config.resolver.blockList = [
  /backend[\\\/].*/,
];

module.exports = config;
