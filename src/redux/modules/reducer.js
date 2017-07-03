import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-async-connect';
import auth from './auth';
import {reducer as form} from 'redux-form';
import modal from './modal';
import setDetails from './setDetails';
import typeDetails from './typeDetails';
import profileDetails from './profileDetails';
import searchInput from './searchInput';
import mainSearch from './mainSearch';
import searchResults from './searchResults';
import object from './object';


const createNamedWrapperReducer = (reducerFunction, reducerName) => {
  return (state, action) => {
    const {name} = action;
    const isInitializationCall = state === undefined;
    if (name !== reducerName && !isInitializationCall) {
      return state;
    }
    return reducerFunction(state, action);
  };
};


export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  auth,
  form,
  modal,
  mainSearchBar: createNamedWrapperReducer(searchInput, 'mainSearchBar'),
  setSearchBar: createNamedWrapperReducer(searchInput, 'setSearchBar'),
  mainSearch,
  mainDataSetResults: createNamedWrapperReducer(searchResults, 'mainDataSetResults'),
  mainDataTypeResults: createNamedWrapperReducer(searchResults, 'mainDataTypeResults'),
  setResults: createNamedWrapperReducer(searchResults, 'setResults'),
  setDetails,
  typeDetails,
  profileDetails,
  object
});
