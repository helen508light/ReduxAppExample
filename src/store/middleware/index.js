import {applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import {callApi} from './callApi'
import {form} from './form'

const logger = createLogger();

export default compose(
    applyMiddleware(thunk, callApi, form),
    window && window.devToolsExtension ? window.devToolsExtension() : f => f
)