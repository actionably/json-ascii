'use strict'

const _ = require('lodash')

class UTF8FourByte {

  // encodes all 4 byte utf-8 characters as html entities
  encode(string) {
    return string.replace(/&#x/g, '&amp;#x').replace(/([\uD800-\uDBFF][\uDC00-\uDFFF])/g, s => {
      return '&#x' + s.codePointAt(0).toString(16) + ';'
    })
  }

  // decodes all html entities representing 4 byte utf-8 characters
  decode(string) {
    return string.replace(/&#x([a-fA-F\d]+);/g, (s, entity) => {
      const codePoint = parseInt(entity, 16)
      if (codePoint >= 0x1f000) {
        return String.fromCodePoint(codePoint)
      } else {
        return s
      }
    }).replace(/&amp;#x/g, '&#x')
  }

  encodeObject(obj) {
    return _.cloneDeepWith(obj, value => {
      if (_.isString(value)) {
        return this.encode(value)
      }
    })
  }

  decodeObject(obj) {
    return _.cloneDeepWith(obj, value => {
      if (_.isString(value)) {
        return this.decode(value)
      }
    })
  }
}

module.exports = new UTF8FourByte()
