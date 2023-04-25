import { combineRgb } from '@companion-module/base'

export function getPresets() {
	const ColorWhite = combineRgb(255, 255, 255)
	const ColorBlack = combineRgb(0, 0, 0)
	const ColorRed = combineRgb(200, 0, 0)
	const ColorGreen = combineRgb(0, 200, 0)
	const ColorOrange = combineRgb(255, 102, 0)

	let presets = {
		cycleSourcePrevious: {
			type: 'button',
			category: 'Change Decode Source',
			name: 'Cycle Source Previous',
			options: {},
			style: {
				text: 'Prev Source',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'cycleSource',
							options: {
								jump: 'previous',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		cycleSourceNext: {
			type: 'button',
			category: 'Change Decode Source',
			name: 'Cycle Source Next',
			options: {},
			style: {
				text: 'Next Source',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [
						{
							actionId: 'cycleSource',
							options: {
								jump: 'next',
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		},
		currentSource: {
			type: 'button',
			category: 'Status',
			name: 'Source Status',
			options: {},
			style: {
				text: 'Source: $(birddog-converters:decode_source)',
				size: '7',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [],
					up: [],
				},
			],
			feedbacks: [],
		},
		videoFormat: {
			type: 'button',
			category: 'Status',
			name: 'Video Format',
			options: {},
			style: {
				text: 'Format: $(birddog-converters:video_format)',
				size: '7',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [],
					up: [],
				},
			],
			feedbacks: [],
		},
		frameRate: {
			type: 'button',
			category: 'Status',
			name: 'Video Frame rate',
			options: {},
			style: {
				text: 'Frame Rate: $(birddog-converters:video_framerate)',
				size: '7',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [],
					up: [],
				},
			],
			feedbacks: [],
		},
		sourceStatus: {
			type: 'button',
			category: 'Status',
			name: 'Source Status',
			options: {},
			style: {
				text: '$(birddog-converters:source_status)',
				size: '7',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'decodeSourceStatus',
					options: {},
					style: {
						bgcolor: ColorGreen,
					},
				},
			],
		},
	}

	if (!this.legacy) {
		presets.refreshNDISourceList = {
			type: 'button',
			category: 'NDI Source List',
			name: 'Refresh Source List',
			options: {},
			style: {
				text: 'Refresh NDI Sources',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [{ actionId: 'refreshNDISourceList' }],
					up: [],
				},
			],
			feedbacks: [],
		}
		presets.reboot = {
			type: 'button',
			category: 'Device',
			name: 'Reboot Device',
			options: {},
			style: {
				text: 'Reboot',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [{ actionId: 'reboot' }],
					up: [],
				},
			],
			feedbacks: [],
		}
		presets.rebootDeviceName = {
			type: 'button',
			category: 'Device',
			name: 'Reboot Device Name',
			options: {},
			style: {
				text: 'Reboot $(birddog-converters:device_name)',
				size: 'auto',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [{ actionId: 'reboot' }],
					up: [],
				},
			],
			feedbacks: [],
		}
		presets.restart = {
			type: 'button',
			category: 'Device',
			name: 'Restart',
			options: {},
			style: {
				text: 'Restart Video',
				size: '14',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [{ actionId: 'restart' }],
					up: [],
				},
			],
			feedbacks: [],
		}
		presets.restartDeviceName = {
			type: 'button',
			category: 'Device',
			name: 'Restart Device Name',
			options: {},
			style: {
				text: 'Restart $(birddog-converters:device_name) Video',
				size: 'auto',
				color: ColorWhite,
				bgcolor: ColorBlack,
			},
			steps: [
				{
					down: [{ actionId: 'restart' }],
					up: [],
				},
			],
			feedbacks: [],
		}
	}

	if (this.device.list) {
		this.device.list.forEach((source) => {
			presets[`change${source.id}`] = {
				type: 'button',
				category: 'Change Decode Source',
				name: `Change to ${source.id}`,
				options: {},
				style: {
					text: `${source.id}`,
					size: 'auto',
					color: ColorWhite,
					bgcolor: ColorBlack,
				},
				steps: [
					{
						down: [
							{
								actionId: 'changeDecodeSource',
								options: {
									source: `${source.id}`,
								},
							},
						],
						up: [],
					},
				],
				feedbacks: [
					{
						feedbackId: 'decodeSourceName',
						options: {
							source: `${source.id}`,
						},
						style: {
							bgcolor: ColorGreen,
						},
					},
				],
			}
		})
	}

	return presets
}
