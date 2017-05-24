'use strict'

const assert = require('assert')
const stringify = require('json-stable-stringify')
const JSONAscii = require('../json-ascii').jsonAscii

describe('json-ascii test', () => {
  const assertObjectEqual = (expectedObject, actualObject) => {
    assert.equal(stringify(expectedObject, {
      space: 2
    }), stringify(actualObject, {
      space: 2
    }))
  }

  it('plane string', () => {
    assert.equal('plane string', JSONAscii.encodeAscii('plane string'))
  })
  it('smile string', () => {
    assert.equal('&#x263a; string', JSONAscii.encodeAscii('☺ string'))
  })
  it('Latin Small Letter Ae string', () => {
    assert.equal('&#xe6; string', JSONAscii.encodeAscii('æ string'))
  })
  it('weird shift out character', () => {
    assert.equal('&#x1f609; &#xf;', JSONAscii.encodeAscii('😉 \x0F'))
  })
  it('COMBINING RING ABOVE string', () => {
    assert.equal('a&#x30a; string', JSONAscii.encodeAscii('å string'))
  })
  it('japan string', () => {
    assert.equal('&#x3073; string', JSONAscii.encodeAscii('び string'))
  })
  it('smile wink string', () => {
    assert.equal('&#x1f609; string', JSONAscii.encodeAscii('😉 string'))
  })
  it('encoded &', () => {
    assert.equal('& string', JSONAscii.encodeAscii('& string'))
  })
  it('encoded smaile and smile string', () => {
    assert.equal('&amp;#x1f609; and &#x1f609; string', JSONAscii.encodeAscii('&#x1f609; and 😉 string'))
  })
  it('encoded/decode object with a smile', () => {
    const testObject = {
      test: '😉 string',
      array: ['silly & good', '😉']
    }
    assertObjectEqual(testObject,
      JSONAscii.parseWithDecode(JSONAscii.stringifyAscii(testObject)))
  })
  it('encoded/decode object with a weird shift', () => {
    const testObject = {
      test: '😉 \x0F string',
    }
    assertObjectEqual(testObject,
      JSONAscii.parseWithDecode(JSONAscii.stringifyAscii(testObject)))
  })

  it('COMBINING RING ABOVE string no four byte', () => {
    assert.equal('å string', JSONAscii.encodeNoFourByte('å string'))
  })
  it('japan string no four byte', () => {
    assert.equal('び string', JSONAscii.encodeNoFourByte('び string'))
  })
  it('smile wink string no four byte', () => {
    assert.equal('&#x1f609; string', JSONAscii.encodeNoFourByte('😉 string'))
  })

  it('decode bad character', () => {
    const testObject = {
      test: 'string'
    }
    const badString = '{"test":"string\x0F"}'
    assertObjectEqual(testObject,
      JSONAscii.parseWithDecode(badString, true))
  })

  it('this dun not work', () => {
    const str = 'M：\n午安喔'
    const removedInvalids = JSONAscii.removeInvalidChars(str)
    console.log(removedInvalids)
    assert.equal(str, removedInvalids)
  })

  it('object stringified and then back is untouched', () => {
    const str = 'M：\n我都會拿工具打 例如；雜誌、書'
    const jsonObject = {
      foo: str
    }
    const stringified = JSONAscii.stringifyAscii(jsonObject)
    const backFromString = JSONAscii.parseWithDecode(stringified, true)
    assertObjectEqual(jsonObject, backFromString)
  })

  it('an object encoded using object-property-base64-ecoder is untouched by this library', () => {
    const jsonObject = {
      str: 'Zm9v',
      array: 'WyJmb28iLCJiYXIiXQ==',
      bar: 'eyJiYXoiOiJiYXoifQ==',
      untouched: 123,
      base64EncoderConfig: {
        str: {}
      }
    }
    const backFromString = JSONAscii.parseWithDecode(JSON.stringify(jsonObject), true)
    assertObjectEqual(jsonObject, backFromString)

  })
})
