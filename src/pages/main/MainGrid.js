import {Component, PropTypes} from 'react'
import ReactDataGrid from 'react-data-grid'
import Modal from 'react-modal'
import { change } from 'redux-form'
import {connect} from 'react-redux'
import moment from 'moment'

import {DATE_FORMAT, EQUIPMENT_OPERATIONAL_DATA_FORM_NAME} from '../InventoryConstants'
import {MainForm} from './MainForm'
import {formDataGet as formDataGetOriginal} from '../../../store/AC/form/formDataGet'
import {formDataRemove as formDataRemoveOriginal} from '../../../store/AC/form/formDataRemove'
import {EDIT_DATA} from "../../admin/roles/Permissions";
import * as React from "react";
import {hasPermission} from "../../../utils/hasPermission";

const formDataGet = formDataGetOriginal('infoUrl')
const removeData = formDataRemoveOriginal('infoUrl')

const customStyles = {
    overlay: {
        zIndex: '999',
        backgroundColor: '#777'
    }
};

@connect((state, props)=>{

    const { userAction } = props
    const { urls:{infoUrl}, user } = state

    return {
        url: infoUrl,
        user,
        userAction
    }
}, {
    formDataGet,
    formDataRemove,
    change
})
export class ConsumablesGrid extends Component {

    state = {
        ready: false,
        modalIsOpen: false,
        formElementId: null
    }
    Rows = [];

    componentWillMount() {
        let equipment = this.context.getEquipment();

        if (equipment instanceof Object && Object.keys(equipment).length > 0) {
            this.createConsumablesGridRows(Object.assign({},equipment.operationalData));
            this.setState({
                ready: true,
                operationalDataId: equipment.operationalData.id
            })
        } else {
            this.setState({
                ready: true
            })
        }
    }

    updateRows = () => {
        const { formDataGet, change} = this.props

            formGet(params.id)
                .then(({json})=> {

                    change(EQUIPMENT_OPERATIONAL_DATA_FORM_NAME, 'operationalData.consumables', json.operationalData.consumables);

                    this.createGridRows(json.data);

                    this.setState({
                        modalIsOpen: false,
                        formElementId: null
                    });


                }, (err)=> {
                    if (err.status === 404) {
                        browserHistory.replace(contextPath + '/404')
                    } else {
                        browserHistory.replace(contextPath + '/500')
                    }
                })
        
    }

    createGridRows(data) {
        if (data.items) {
            let rows = [];
            data.items.forEach(function (item) {
                let row = {}
                row.id = item.id;
                row.creationDate = moment(item.creationDate).format(DATE_FORMAT);
                row.name = item.baseInfo.name;
                rows.push(row);
            });
            this.Rows = rows;
        }
    }

    rowGetter = (i) => {
        return this.Rows[i];
    }

    emptyRowsView() {
        return (<div>Нет записей</div>);
    }

    openModal = () => {
        this.setState({
            modalIsOpen: true
        });
    }

    closeModal = () => {
        this.updateRows();
    }

    editRow = (id) => {
        this.setState({
            formElementId: id,
            modalIsOpen: true
        })
    }

    deleteRows = (id) => {
        this.props.formDataRemove(id)
            .then(() => {
                this.updateRows();
            })
    }

    getConsumableGridColumns() {
        const { userAction, user } = this.props

        let columns = [
            { key: 'creationDate', name: 'Дата установки'},
            { key: 'name', name: 'Полное название прибора' }
        ];

        if('edit'===userAction && hasPermission(user, EDIT_DATA)) {
            columns.push(
                {
                    name: '',
                    key: '$delete $edit',
                    getRowMetaData: (row) => row,
                    formatter: ({ dependentValues }) => (
                        <span>
                           <a href="javascript:;" className="glyphicon glyphicon-remove" onClick={() => this.deleteRows(dependentValues.id)} ></a>
                            {' '}
                            <a href="javascript:;" className="glyphicon glyphicon-edit" onClick={() => this.editRow(dependentValues.id)}></a>
                       </span>)
                }
            )
        }

        return columns
    }

    render() {
        const { user, userAction } = this.props

        if (!this.state.ready) return null;

        return (
            <div >
                <h2>Основные данные</h2>

                {'edit' ===userAction && hasPermission(user, EDIT_DATA)
                    ? <div className="form-group"><button onClick={this.openModal}>Добавить</button></div>
                    : <div/>}

                <ReactDataGrid
                    rowKey='id'
                    rowGetter={this.rowGetter}
                    columns={this.getGridColumns()}
                    rowsCount={this.Rows.length}
                    emptyRowsView={this.emptyRowsView}
                    minHeight={200}
                />

                <Modal
                    isOpen={this.state.modalIsOpen}
                    contentLabel="Test label"
                    style={customStyles}
                >
                    <MainForm closeAction={this.closeModal} formElementId={this.state.formElementId} />
                </Modal>
            </div>
        )
    }
}
