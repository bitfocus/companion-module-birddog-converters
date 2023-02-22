export const upgradeScripts = [
	function upgrade300(context, props) {
		const changes = {
			updatedConfig: null,
			updatedActions: [],
			updatedFeedbacks: [],
		}

		if (props.config) {
			if (props.config.info !== undefined) {
				delete props.config.info
			}
			if (props.config.deviceIp !== undefined) {
				props.config.host = props.config.deviceIp

				delete props.config.deviceIp
			}
			changes.updatedConfig = props.config
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
