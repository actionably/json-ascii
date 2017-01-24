'use strict'

const assert = require('assert')
const stringify = require('json-stable-stringify')
const JSONAscii = require('./json-ascii')

describe('json-ascii test', () => {
  const assertObjectEqual = (expectedObject, actualObject) => {
    assert.equal(stringify(expectedObject, {space: 2}), stringify(actualObject, {space: 2}))
  }

  it('plane string', () => {
    assert.equal('plane string', JSONAscii.encode('plane string'))
  })
  it('smile string', () => {
    assert.equal('\\ud83d\\ude09 string', JSONAscii.encode('😉 string'))
  })
  it('encoded/decode object with a smile', () => {
    const testObject = {
      test: '😉 string',
      array: ['silly & good', '😉']
    }
    assertObjectEqual(testObject,
      JSON.parse(JSONAscii.stringifySafe(testObject)))
  })
})
