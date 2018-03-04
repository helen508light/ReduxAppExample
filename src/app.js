import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {Router, Route, IndexRoute, browserHistory} from 'react-router'

import {createStore} from './store'
import {getSettings} from './store/AC/getSettings'
import {getUser} from './store/AC/getUser'

import {BaseLayout} from './containers/BaseLayout'

import {MainForm} from './pages/main/MainForm'
import {Admin} from './pages/admin/Admin'
import {BaseDataForm} from "./pages/inventory/equipmentMainData/BaseDataForm";

import {ErrorPage} from './pages/ErrorPage'
import {PageNotFound} from './pages/PageNotFound'

const contextPath = '/' + (location.pathname.split('/')[1] || '');
const initState = {
    urls: {contextPath}
};

const store = createStore(initState);

store.dispatch(getSettings())
    .then(() => {
        return store.dispatch(getUser())
    });

window.onload = () => {
    render((
        <Provider store={store}>
            <Router history={browserHistory}>
                <Route path={contextPath} components={BaseLayout}>
                    <IndexRoute component={MainForm}/>

                    <Route component={MainForm}/>

                    <Route path="admin" component={Admin}/>
                    <Route path="main" component={MainForm}/>

                    <Route key="PageNotFound" path="500" component={ErrorPage}/>
                    <Route key="PageNotFound" path="*" component={PageNotFound}/>
                </Route>
            </Router>
        </Provider>
    ), document.getElementById('app'))
};