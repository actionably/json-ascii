'use strict'

const _ = require('underscore')

class ObjectPropertyBase64Encoder {

  // encodes all non ascii characters as &#x{hex-code};
  encode(object, fieldList) {
    const returnObject = _.clone(object)
    _.each(fieldList, (field) => {
      if (_.isString(returnObject[field])) {
        returnObject[field] = Buffer.from(returnObject[field]).toString('base64')
      }
    })

    return returnObject
  }

  decode(object, fieldList) {
    const returnObject = _.clone(object)
    _.each(fieldList, (field) => {
      if (_.isString(returnObject[field])) {
        returnObject[field] = Buffer.from(returnObject[field], 'base64').toString('utf-8')
      }
    })

    return returnObject
  }
}

module.exports = new ObjectPropertyBase64Encoder()
