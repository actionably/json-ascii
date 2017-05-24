'use strict'

const _ = require('lodash')

class ObjectPropertyBase64Encoder {

  // encodes all non ascii characters as &#x{hex-code};
  encode(object, fieldListConfiguration) {
    const returnObject = _.clone(object)
    _.each(_.keys(fieldListConfiguration), (field) => {
      if (_.isString(returnObject[field]) && !_.isEqual('null', returnObject[field])) {
        returnObject[field] = Buffer.from(returnObject[field]).toString('base64')
      } else if (_.isObject(returnObject[field]) || _.isArray(returnObject[field])) {
        const type = _.get(fieldListConfiguration[field], 'type')
        if(type && _.includes(['object', 'array'], type)) {
          returnObject[field] = Buffer.from(JSON.stringify(returnObject[field])).toString('base64')
        }
      }
    })

    returnObject.base64EncoderConfig = fieldListConfiguration
    return returnObject
  }

  decode(object, encoderConfiguraiton) {
    let fieldListConfiguration = encoderConfiguraiton || object.base64EncoderConfig
    if (!fieldListConfiguration) {
      return object
    }
    if (_.isString(fieldListConfiguration)) {
      fieldListConfiguration = JSON.parse(fieldListConfiguration)
    }

    const returnObject = _.clone(object)

    _.each(_.keys(fieldListConfiguration), (field) => {
      const type = _.get(fieldListConfiguration[field], 'type')
      if (type && _.includes(['object', 'array'], type)) {
        if (_.isString(returnObject[field]) && !_.isEqual('null', returnObject[field])) {
          const jsonString = Buffer.from(returnObject[field], 'base64').toString('utf-8')
          returnObject[field] = JSON.parse(jsonString)
        }
      } else if (_.isString(returnObject[field])) {
        returnObject[field] = Buffer.from(returnObject[field], 'base64').toString('utf-8')
      }

    })

    delete returnObject.base64EncoderConfig
    return returnObject
  }
}

module.exports = new ObjectPropertyBase64Encoder()
