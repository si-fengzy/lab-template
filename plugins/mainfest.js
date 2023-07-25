const { writeFileSync, copyFileSync } = require('node:fs')
const { join } = require('node:path')
module.exports = class Mainfest {
  constructor (source, to, themeImgSource) {
    this.source = source;
    this.to = to;
    this.themeImgSource = themeImgSource;
  }
  apply (compiler) {
    const { options, hooks } = compiler;

    if (options.mode === 'production') {
      hooks.done.tap('write', (state) => {
        const { name, title, description, themeImg } = require(this.source);

        const mainfest = {
          name,
          title,
          description,
          themeImg
        }
        writeFileSync(join(this.to, 'config.json'), JSON.stringify(mainfest), 'utf-8')
        copyFileSync(this.themeImgSource, join(this.to, themeImg))
      })
      // 
    }
  }
}