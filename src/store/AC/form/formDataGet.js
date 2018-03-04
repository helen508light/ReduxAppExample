import {FORM_DATA} from '../../constants'

export function formDataGet(urlName) {
    return (id) => {
        return (dispatch, getState) => {
            const state = getState()
            const url = state.urls[urlName]

            return dispatch({
                callAPI: true,
                type: FORM_DATA,
                url: url + '/' + id
            })
        }
    }
}