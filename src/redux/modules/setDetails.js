const FETCH = 'setDetails/FETCH';
const FETCH_SUCCESS = 'setDetails/FETCH_SUCCESS';
const FETCH_FAIL = 'setDetails/FETCH_FAIL';

const initialState = {
  loading: false,
  id: '',
  setError: ''
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case FETCH:
      return {
        ...state,
        loading: true,
        id: action.id,
        setError: '',
        items: []
      };
    case FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case FETCH_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
}

export function fetchSet(setId) {
  return {
    types: [FETCH, FETCH_SUCCESS, FETCH_FAIL],
    promise: (client) => client.get('/v2/set/' + setId),
    id: setId
  };
}
