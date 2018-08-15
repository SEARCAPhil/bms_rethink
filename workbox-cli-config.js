module.exports = {
  "globDirectory": ".\\",
  "globPatterns": [
    "www/**/*.{css,woff2,png,js,html,jpg}"
  ],
  "swDest": "sw.js",
  "globIgnores": [
    "workbox-cli-config.js",
    'node_modules/**/*',
    'plugins/**/*',
    'platforms/**/*',
    'hooks/**/*',
    'src/**/*'
  ]
};
