import {REMOVE_ROW} from '../../constants'

export function formDataRemove(urlName) {
    return (id) => {
        return (dispatch, getState) => {
            const state = getState()
            const url = state.urls[urlName]

            return dispatch({
                callAPI: true,
                type: REMOVE_ROW,
                resType: 'text',
                url: url + '/' + id,
                method: 'DELETE'
            })
        }
    }
}