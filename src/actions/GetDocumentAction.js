import * as ActionTypes from './ActionType';
import { connect } from 'react-redux';
import axios from 'react-native-axios';
import GetDocumentComponent from '../components/GetDocumentComponent';

const mapStateToProps = (state) => ({
    isLoading: state.serviceReducer.isLoading,
    error: state.serviceReducer.error,
    data: state.serviceReducer.data
});

const mapDispatchToProps = (dispatch) => ({
    callGetChoose: () => dispatch(GetChooseDocument())
});

export const GetChooseDocument = () => {
    return dispatch => {
        dispatch(serviceActionPending());
        axios.get('http://150.95.110.70:3000/listDocument', { headers: { api_key: 'a08eb42a-4a57-449b-84f4-1f67219f2679' } })
            .then(response => {
                console.log('response', response.data);
                dispatch(serviceActionSuccess(response.data))
            })
            .catch(error => {
                console.log('error', error);
                dispatch(serviceActionError(error))
            });
    }
};

export const serviceActionPending = () => ({
    type: ActionTypes.SERVICE_PENDING
});

export const serviceActionError = (error) => ({
    type: ActionTypes.SERVICE_ERROR,
    error: error
});

export const serviceActionSuccess = (data) => ({
    type: ActionTypes.SERVICE_SUCCESS,
    data: data
});

export default connect(mapStateToProps, mapDispatchToProps)(GetDocumentComponent);