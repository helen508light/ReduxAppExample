import {FORM_SAVE} from '../../constants'

export function formDataSave(urlName) {
    return (values) => {
        return (dispatch, getState) => {
            const state = getState()
            const url = state.urls[urlName]

            return dispatch({
                callAPI: true,
                type: FORM_SAVE,
                resType: 'text',
                url: url + (values.id ? `/${values.id}` : ''),
                method: values.id ? 'PUT' : 'POST',
                data: values
            })
        }
    }
}