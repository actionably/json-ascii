'use strict'

const assert = require('assert')
const stringify = require('json-stable-stringify')
const utf8FourByte = require('../utf8-four-byte')

describe('utf-8 4-byte test', () => {
  const assertObjectEqual = (expectedObject, actualObject) => {
    assert.equal(stringify(expectedObject, {space: 2}), stringify(actualObject, {space: 2}))
  }

  it('plane string', () => {
    assert.equal('plane string', utf8FourByte.encode('plane string'))
  })
  it('smile string', () => {
    assert.equal('&#x1f609; string', utf8FourByte.encode('😉 string'))
  })
  it('encoded &', () => {
    assert.equal('& string', utf8FourByte.encode('& string'))
  })
  it('encoded smaile and smile string', () => {
    assert.equal('&amp;#x1f609; and &#x1f609; string', utf8FourByte.encode('&#x1f609; and 😉 string'))
  })
  it('encoded/decode smaile and smile string', () => {
    assert.equal('&#x1f609; and 😉 string',
      utf8FourByte.decode(utf8FourByte.encode('&#x1f609; and 😉 string')))
  })
  it('encoded/decode object with a smile', () => {
    const testObject = {
      test: '😉 string',
      array: ['silly & good', '😉']
    }
    assertObjectEqual(testObject,
      utf8FourByte.decodeObject(utf8FourByte.encodeObject(testObject)))
  })
})
