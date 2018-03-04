import {Component, PropTypes} from 'react'
import {MainGrid} from './MainGrid'
import {connect} from 'react-redux'
import {formDataGet as formDataGetOriginal} from '../../../store/AC/form/formDataGet'
import moment from 'moment'

const formDataGet = formDataGetOriginal('infoUrl');

@connect((state, props)=>{
    const { route: {path}} = props
    const { urls:{infoUrl}} = state

    let action = path.split('/')[2]


    return {
        url: infoUrl,
        userAction: action
    }
}, {
    formDataGet
})
export class MainPage extends Component {
    state = {
        ready: false,
        data: {}
    }

    componentWillMount() {
        const {formGet} = this.props;
            formDataGet(params.id)
                .then(({json})=> {
                    this.setState({
                        ready: true,
                        data: json
                    });
                }, (err)=> {
                    if (err.status === 404) {
                        browserHistory.replace(contextPath + '/404')
                    } else {
                        browserHistory.replace(contextPath + '/500')
                    }
                })
    }

    render() {
        const { userAction } = this.props

        if (!this.state.ready) return null;

        return (
            <div>
                <MainGrid {...this.props}/>
            </div>
        )
    }
}