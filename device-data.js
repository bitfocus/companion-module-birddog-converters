export function normalizeOperationMode(value) {
	const mode = String(value ?? '')
		.trim()
		.toLowerCase()

	if (mode === 'encode') return 'Encode'
	if (mode === 'decode') return 'Decode'

	return String(value ?? '').trim() || 'Unknown'
}

export function normalizeSourceStatus(value) {
	const status = String(value ?? '').trim()
	const prefixedStatus = status.match(/^NDI SOURCE STATUS:\s*(.+)$/i)

	return prefixedStatus ? prefixedStatus[1].trim() : status
}

export function supportsOperationMode(about, availableFormats) {
	return (
		availableFormats.includes(about?.Format) || /BirdDog\s+Flex\s+4K\s+Out/i.test(String(about?.FirmwareVersion ?? ''))
	)
}
