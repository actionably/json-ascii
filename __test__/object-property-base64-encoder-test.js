'use strict'

const assert = require('assert')
const stringify = require('json-stable-stringify')
const objectPropertyEncoder = require('../object-property-base64-encoder')

describe('object property encdoer test', () => {
  const assertObjectEqual = (expectedObject, actualObject) => {
    assert.equal(stringify(actualObject, {
      space: 2
    }), stringify(expectedObject, {
      space: 2
    }))
  }

  it('encode/decode object with unspecified types should ignore non strings', () => {
    const objectToEncode = {
      str: 'foo',
      bar: {
        baz: 'baz'
      },
      array: ['foo', 'bar'],
      untouched: 123
    }
    const encoderConfig = {str: {}, array: {}}
    const encodedObject = objectPropertyEncoder.encode(objectToEncode, encoderConfig)
    assertObjectEqual({
      str: 'Zm9v',
      bar: {
        baz: 'baz'
      },
      array: ['foo', 'bar'],
      untouched: 123,
      base64EncoderConfig: encoderConfig
    }, encodedObject)
    const decodedObject = objectPropertyEncoder.decode(encodedObject, encodedObject.base64EncoderConfig)
    assertObjectEqual(objectToEncode, decodedObject)
  })

  it('encode/decode object with specified types should encode non strings', () => {
    const objectToEncode = {
      str: 'foo',
      bar: {
        baz: 'baz'
      },
      array: ['foo', 'bar'],
      untouched: 123
    }
    const encoderConfig = {
      str: {},
      array: {type: 'array'},
      bar: {type: 'object'},
      foobar: {type: 'object'}
    }
    const encodedObject = objectPropertyEncoder.encode(objectToEncode, encoderConfig)
    assertObjectEqual({
      str: 'Zm9v',
      array: 'WyJmb28iLCJiYXIiXQ==',
      bar: 'eyJiYXoiOiJiYXoifQ==',
      untouched: 123,
      base64EncoderConfig: encoderConfig
    }, encodedObject)
    const decodedObject = objectPropertyEncoder.decode(encodedObject, encodedObject.base64EncoderConfig)
    assertObjectEqual(objectToEncode, decodedObject)
  })

  it('the string null for objects and arrays should remain untouched becuase its messed up. in the data stream', () => {
    const objectToEncode = {
      str: 'foo',
      bar: 'null',
      array: 'null',
      untouched: 123
    }
    const encoderConfig = {
      str: {},
      array: {type: 'array'},
      bar: {type: 'object'},
      foobar: {type: 'object'}
    }
    const encodedObject = objectPropertyEncoder.encode(objectToEncode, encoderConfig)
    assertObjectEqual({
      str: 'Zm9v',
      array: 'null',
      bar: 'null',
      untouched: 123,
      base64EncoderConfig: encoderConfig
    }, encodedObject)
    const decodedObject = objectPropertyEncoder.decode(encodedObject, encodedObject.base64EncoderConfig)
    assertObjectEqual(objectToEncode, decodedObject)
  })

  it('when working with kinesis analytics this gets turned into a string parse it and use it in that case', () => {
    const objectToDecode = {
      canonicalMessageJson: 'eyJ0ZXh0IjoiTVx1MDAxYVxuJiN4NjIxMTsifQ==',
      base64EncoderConfig: '{"text":{},"messageJson":{"type":"object"},"canonicalMessageJson":{"type":"object"},' +
      '"metadata":{"type":"object"}}'
    }

    const decodedObject = objectPropertyEncoder.decode(objectToDecode)
    assertObjectEqual({
      canonicalMessageJson: {
        'text': 'M\u001a\n&#x6211;'
      }
    }, decodedObject)
  })
})
