'use strict'

const assert = require('assert')
const stringify = require('json-stable-stringify')
const JSONAscii = require('./json-ascii')

describe('json-ascii test', () => {
  const assertObjectEqual = (expectedObject, actualObject) => {
    assert.equal(stringify(expectedObject, {
      space: 2
    }), stringify(actualObject, {
      space: 2
    }))
  }

  it('plane string', () => {
    assert.equal('plane string', JSONAscii.encode('plane string'))
  })
  it('smile string', () => {
    assert.equal('&#x263a; string', JSONAscii.encode('☺ string'))
  })
  it('Latin Small Letter Ae string', () => {
    assert.equal('&#xe6; string', JSONAscii.encode('æ string'))
  })
  it('COMBINING RING ABOVE string', () => {
    assert.equal('a&#x30a; string', JSONAscii.encode('å string'))
  })
  it('japan string', () => {
    assert.equal('&#x3073; string', JSONAscii.encode('び string'))
  })
  it('smile wink string', () => {
    assert.equal('&#x1f609; string', JSONAscii.encode('😉 string'))
  })
  it('encoded &', () => {
    assert.equal('& string', JSONAscii.encode('& string'))
  })
  it('encoded smaile and smile string', () => {
    assert.equal('&amp;#x1f609; and &#x1f609; string', JSONAscii.encode('&#x1f609; and 😉 string'))
  })
  it('encoded/decode object with a smile', () => {
    const testObject = {
      test: '😉 string',
      array: ['silly & good', '😉']
    }
    assertObjectEqual(testObject,
      JSONAscii.parseAscii(JSONAscii.stringifyAscii(testObject)))
  })
})
