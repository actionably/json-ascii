'use strict'

const _ = require('lodash')

class ObjectPropertyBase64Encoder {

  // encodes all non ascii characters as &#x{hex-code};
  encode(object, fieldListConfiguration) {
    const returnObject = _.clone(object)
    _.each(_.keys(fieldListConfiguration), (field) => {
      if (_.isString(returnObject[field])) {
        returnObject[field] = Buffer.from(returnObject[field]).toString('base64')
      } else if (_.isObject(returnObject[field]) || _.isArray(returnObject[field])) {
        const type = _.get(fieldListConfiguration[field], 'type')
        if(type && _.find(['object', 'array'], type)) {
          returnObject[field] = Buffer.from(JSON.stringify(returnObject[field])).toString('base64')
        }
      }
    })

    return returnObject
  }

  decode(object, fieldListConfiguration) {
    const returnObject = _.clone(object)
    _.each(_.keys(fieldListConfiguration), (field) => {
      if (_.isString(returnObject[field])) {
        returnObject[field] = Buffer.from(returnObject[field], 'base64').toString('utf-8')
      } else if (_.isObject(returnObject[field]) || _.isArray(returnObject[field])) {
        const type = _.get(fieldListConfiguration[field], 'type')
        if(type && _.find(['object', 'array'], type)) {
          returnObject[field] = JSON.parse(Buffer.from(returnObject[field], 'base64').toString('utf-8'))
        }
      }
    })

    return returnObject
  }
}

module.exports = new ObjectPropertyBase64Encoder()
