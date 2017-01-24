'use strict'

class JSONAscii {

  // encodes all non ascii characters as \u{hex-code}
  // which allows parsing with JSON.parse
  encode(string) {
    return string.replace(/([\x7F-\uFFFF])/g, s => {
      return '\\u' + ('0000' + s.charCodeAt(0).toString(16)).slice(-4)
    })
  }

  // outputs valid JSON that is entirely made up of ascii characters.
  // when JSON.parse is applied to the string orginally object
  // with all UTF-8 characters is returned.
  stringifySafe(obj) {
    const s = JSON.stringify(obj)
    return this.encode(s)
  }

}

module.exports = new JSONAscii()
