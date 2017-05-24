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
      str: "foo",
      bar: {
        baz: "baz"
      },
      array: ['foo', 'bar'],
      untouched: 123
    }
    const encodedObject = objectPropertyEncoder.encode(objectToEncode, {str: {}, array: {}})
    assertObjectEqual({
      str: 'Zm9v',
      bar: {
        baz: 'baz'
      },
      array: ['foo', 'bar'],
      untouched: 123
    }, encodedObject)
    const decodedObject = objectPropertyEncoder.decode(encodedObject, {str: {}, array: {}})
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
    const encodedObject = objectPropertyEncoder.encode(objectToEncode, {
      str: {},
      array: {type: 'array'},
      bar: {type: 'object'},
      foobar: {type: 'object'}
    })
    assertObjectEqual({
      str: 'Zm9v',
      array: 'WyJmb28iLCJiYXIiXQ==',
      bar: 'eyJiYXoiOiJiYXoifQ==',
      untouched: 123
    }, encodedObject)
    const decodedObject = objectPropertyEncoder.decode(encodedObject, {
      str: {},
      array: {type: 'array'},
      bar: {type: 'object'},
      foobar: {type: 'object'}
    })
    assertObjectEqual(objectToEncode, decodedObject)
  })

  it('the string null for objects and arrays should remain untouched becuase its messed up. in the data stream', () => {
    const objectToEncode = {
      str: 'foo',
      bar: 'null',
      array: 'null',
      untouched: 123
    }
    const encodedObject = objectPropertyEncoder.encode(objectToEncode, {
      str: {},
      array: {type: 'array'},
      bar: {type: 'object'},
      foobar: {type: 'object'}
    })
    assertObjectEqual({
      str: 'Zm9v',
      array: 'null',
      bar: 'null',
      untouched: 123
    }, encodedObject)
    const decodedObject = objectPropertyEncoder.decode(encodedObject, {
      str: {},
      array: {type: 'array'},
      bar: {type: 'object'},
      foobar: {type: 'object'}
    })
    assertObjectEqual(objectToEncode, decodedObject)
  })
})
