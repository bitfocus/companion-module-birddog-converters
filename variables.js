export function getVariables() {
	const variables = []

	variables.push({
		name: 'Name of current decode source',
		variableId: 'decode_source',
	})

	variables.push({
		name: 'Current mode (encode/decode) of the device',
		variableId: 'current_mode',
	})

	variables.push({
		name: 'Video format (resolution and framerate)',
		variableId: 'video_format',
	})

	variables.push({
		name: 'Video resolution',
		variableId: 'video_resolution',
	})

	variables.push({
		name: 'Video framerate',
		variableId: 'video_framerate',
	})

	variables.push({
		name: 'Current source connection status',
		variableId: 'source_status',
	})

	variables.push({
		name: 'Name of converter',
		variableId: 'device_name',
	})

	return variables
}

export function updateVariables() {
	this.setVariableValues({
		decode_source: this.device.decodeSource,
		current_mode: this.device.currentMode,
		video_format: this.device.videoFormat,
		video_format: this.device.sourceStatus,
	})
}
