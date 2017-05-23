'use strict'

const assert = require('assert')
const stringify = require('json-stable-stringify')
const objectPropertyEncoder = require('../object-property-base64-encoder')

describe('object property encdoer test', () => {
  const assertObjectEqual = (expectedObject, actualObject) => {
    assert.equal(stringify(expectedObject, {
      space: 2
    }), stringify(actualObject, {
      space: 2
    }))
  }

  it('encode/decode object', () => {
    const objectToEncode = {
      str: "foo",
      bar: {
        baz: "baz"
      },
      array: ['foo', 'bar'],
      untouched: 123
    }
    const encodedObject = objectPropertyEncoder.encode(objectToEncode, ['str', 'array'])
    assertObjectEqual({
      str: "Zm9v",
      bar: {
        baz: "baz"
      },
      array: ['foo', 'bar'],
      untouched: 123
    }, encodedObject)
    const decodedObject = objectPropertyEncoder.decode(encodedObject, ['str', 'array'])
    assertObjectEqual(objectToEncode, decodedObject)
  })
})
