'use strict'

class JSONAscii {

  // encodes all non ascii characters as &#x{hex-code};
  encode(string) {
    return string.replace(/&#x/g, '&amp;#x').replace(/([\x7F-\uD7FF]|[\uD800-\uDBFF][\uDC00-\uDFFF])/g, s => {
      return '&#x' + s.codePointAt(0).toString(16) + ';'
    })
  }

  decode(string) {
    return string.replace(/&#x([a-fA-F\d]+);/g, (s, entity) => {
      return String.fromCodePoint(parseInt(entity, 16))
    }).replace(/&amp;#x/g, '&#x')
  }

  // outputs valid JSON that is entirely made up of ascii characters.
  // to restore the orginal obj use JSONAscii.parseAscii
  stringifyAscii(obj) {
    const s = JSON.stringify(obj)
    return this.encode(s)
  }

  parseAscii(s) {
    const s2 = this.decode(s)
    return JSON.parse(s2)
  }

}

module.exports = new JSONAscii()
