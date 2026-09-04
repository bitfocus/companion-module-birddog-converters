import assert from 'node:assert/strict'
import test from 'node:test'
import { buildRequestUrl } from '../request.js'

test('adds the selected BirdDog decoder channel to a request', () => {
	assert.equal(buildRequestUrl('quad.local', 'connectTo', { ChNum: 3 }), 'http://quad.local:8080/connectTo?ChNum=3')
})

test('leaves existing single-channel requests unchanged', () => {
	assert.equal(buildRequestUrl('decoder.local', 'connectTo'), 'http://decoder.local:8080/connectTo')
})
