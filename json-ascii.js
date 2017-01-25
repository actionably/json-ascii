'use strict'

class JSONAscii {

  // encodes all non ascii characters as &#x{hex-code};
  encodeAscii(string) {
    const reg = /([\x00-\x07\x0b\x0e-\x1f\x7F-\uD7FF]|[\uD800-\uDBFF][\uDC00-\uDFFF])/g
    return string.replace(/&#x/g, '&amp;#x').replace(reg, s => {
      return '&#x' + s.codePointAt(0).toString(16) + ';'
    })
  }

  // encodes four byte UTF-8 characters as &#x{hex-code};
  encodeNoFourByte(string) {
    const reg = /([\uD800-\uDBFF][\uDC00-\uDFFF])/g
    return string.replace(/&#x/g, '&amp;#x').replace(reg, s => {
      return '&#x' + s.codePointAt(0).toString(16) + ';'
    })
  }

  removeInvalidChars(string) {
    return string.replace(/[\x00-\x07\x0b\x0e-\x1f]/g, '')
  }

  decode(string, removeInvalid) {
    if (removeInvalid) {
      string = this.removeInvalidChars(string)
    }
    return string.replace(/&#x([a-fA-F\d]+);/g, (s, entity) => {
      return String.fromCodePoint(parseInt(entity, 16))
    }).replace(/&amp;#x/g, '&#x')
  }

  // outputs valid JSON that is entirely made up of ascii characters.
  // to restore the orginal obj use JSONAscii.parseAscii
  stringifyAscii(obj) {
    const s = JSON.stringify(obj)
    return this.encodeAscii(s)
  }

  stringifyNoFourByte(obj) {
    const s = JSON.stringify(obj)
    return this.encodeNoFourByte(s)
  }

  parseWithDecode(s, removeInvalid) {
    const s2 = this.decode(s, removeInvalid)
    return JSON.parse(s2)
  }

}

module.exports = new JSONAscii()
