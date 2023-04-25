import { combineRgb } from '@companion-module/base'

export function getFeedbacks() {
	const feedbacks = {}

	const ColorWhite = combineRgb(255, 255, 255)
	const ColorBlack = combineRgb(0, 0, 0)
	const ColorRed = combineRgb(200, 0, 0)
	const ColorGreen = combineRgb(0, 200, 0)
	const ColorOrange = combineRgb(255, 102, 0)

	feedbacks['decodeSourceName'] = {
		type: 'boolean',
		name: 'Change style based on current decode source name',
		description: 'Change style if current source name matches selected source',
		defaultStyle: {
			bgcolor: ColorGreen,
		},
		options: [
			{
				type: 'dropdown',
				label: 'Source',
				id: 'source',
				choices: this.device.list,
				default: 'None',
				allowCustom: true,
			},
		],
		callback: (feedback) => {
			if (this.device.decodeSource === feedback.options.source) {
				return true
			}
		},
	}

	feedbacks['decodeSourceStatus'] = {
		type: 'boolean',
		name: 'Change style if current decode source connected',
		description: 'Change style if current source is connected',
		defaultStyle: {
			bgcolor: ColorGreen,
		},
		options: [],
		callback: () => {
			if (this.device.sourceStatus == 'Connected') {
				return true
			}
		},
	}

	return feedbacks
}
