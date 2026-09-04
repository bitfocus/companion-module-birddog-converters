import assert from 'node:assert/strict'
import test from 'node:test'
import { getActions } from '../actions.js'

test('sends a source change to the selected BirdDog decoder channel', () => {
	const calls = []
	const actions = getActions.call({
		device: { list: [] },
		legacy: false,
		sendCommand: (...args) => calls.push(args),
	})

	actions.changeDecodeSource.callback({ options: { source: 'Studio Camera 3', channel: 4 } })

	assert.deepEqual(calls, [['connectTo', 'POST', { sourceName: 'Studio Camera 3' }, { ChNum: 4 }]])
})
