export const upgradeScripts = [
	function upgrade300(context, props) {
		const changes = {
			updatedConfig: null,
			updatedActions: [],
			updatedFeedbacks: [],
		}

		if (props.config) {
			let config = props.config
			if (config.info !== undefined) {
				delete config.info
			}
			if (config.deviceIp !== undefined) {
				config.host = config.deviceIp

				delete config.deviceIp
			}
			changes.updatedConfig = config
		}

		for (let action of props.actions) {
			if (action.options === undefined) {
				action.options = {}
			}

			switch (action.actionId) {
				case 'changeNDISource':
					if (action.options.source === 'No sources found') {
						action.options.source = 'None'
					} else {
						action.options.source = action.options.source
					}
					action.actionId = 'changeDecodeSource'

					changes.updatedActions.push(action)
					break
				case 'changeNDISourceIP':
					action.options.source = action.options.ndiSource
					action.actionId = 'changeDecodeSource'

					delete action.options.ndiSource
					delete action.options.ndiSourcePort
					delete action.options.ndiSourceIp

					changes.updatedActions.push(action)
					break
				case 'refreshNDISourceList':
					action.actionId = 'refreshSourceList'

					changes.updatedActions.push(action)
					break
			}
		}
		return changes
	},
]
