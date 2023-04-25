export function getActions() {
	let actions = {
		changeDecodeSource: {
			name: 'Change Decode Source',
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
			callback: (action) => {
				this.sendCommand('connectTo', 'POST', { sourceName: action.options.source })
			},
		},
		cycleSource: {
			name: 'Jump to Next/Previous Decode Source',
			description: 'Moves between available NDI decode sources',
			options: [
				{
					type: 'dropdown',
					label: 'Action',
					id: 'jump',
					choices: [
						{ id: 'next', label: 'Next' },
						{ id: 'previous', label: 'Previous' },
					],
					default: 'next',
				},
			],
			callback: async (action) => {
				let modifier = action.options.jump === 'next' ? 1 : -1
				let current = this.device.decodeSource
				let newIndex = 0
				if (current) {
					let currentIndex = await this.device.list.findIndex((x) => x.id === current)
					if (currentIndex > -1) {
						newIndex = currentIndex + modifier
						if (newIndex > -1) {
							let source = this.device.list[newIndex]
							if (source) {
								this.sendCommand('connectTo', 'POST', { sourceName: this.device.list[newIndex].id })
							}
						}
					}
				}
			},
		},
	}

	if (!this.legacy) {
		actions.refreshSourceList = {
			name: 'Refresh NDI Source List',
			options: [],
			callback: () => {
				this.sendCommand('refresh', 'GET')
				this.sendCommand('List', 'GET')
			},
		}
		actions.reboot = {
			name: 'Reboot Device',
			options: [],
			callback: () => {
				this.sendCommand('reboot', 'GET')
			},
		}
		actions.restart = {
			name: 'Restart Video',
			options: [],
			callback: () => {
				this.sendCommand('restart', 'GET')
			},
		}
	}

	return actions
}
