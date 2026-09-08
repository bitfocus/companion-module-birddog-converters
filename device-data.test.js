import assert from 'node:assert/strict'
import test from 'node:test'

import { normalizeOperationMode, normalizeSourceStatus, supportsOperationMode } from './device-data.js'

test('normalizes the Flex 4K Out source status prefix', () => {
	assert.equal(normalizeSourceStatus('NDI SOURCE STATUS: Connected'), 'Connected')
	assert.equal(normalizeSourceStatus('Connected'), 'Connected')
})

test('normalizes operation mode text returned by the device', () => {
	assert.equal(normalizeOperationMode('decode\r\n'), 'Decode')
	assert.equal(normalizeOperationMode('encode'), 'Encode')
	assert.equal(normalizeOperationMode(''), 'Unknown')
})

test('queries operation mode for the reported Flex 4K Out identity', () => {
	assert.equal(
		supportsOperationMode({ Format: 'CAM 1', FirmwareVersion: 'BirdDog Flex 4K Out 4.5.158-LTS' }, [
			'Studio',
			'Mini',
			'4KHDMI/SDI',
			'QUAD',
		]),
		true,
	)
})
