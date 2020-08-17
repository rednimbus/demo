// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    // to edit target browsers: use "browserslist" field in package.json
    "autoprefixer": {},
    "postcss-px-to-viewport": {
      "unitToConvert": "PX",
      "viewportWidth": 375,
      "viewportHeight": 667,
      "unitPrecision": 3,
      "viewportUnit": "vw",
      "selectorBlackList": [
        ".ignore",
        ".hairlines"
      ],
      "minPixelValue": 1,
      "mediaQuery": false
    }
  }
}
