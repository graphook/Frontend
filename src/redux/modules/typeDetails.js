const FETCH = 'typeDetails/FETCH';
const FETCH_SUCCESS = 'typeDetails/FETCH_SUCCESS';
const FETCH_FAIL = 'typeDetails/FETCH_FAIL';

const initialState = {
  loading: false,
  id: '',
  error: ''
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case FETCH:
      return {
        ...initialState,
        loading: true,
        id: action.id,
        setError: ''
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

export function fetchType(typeId) {
  return {
    types: [FETCH, FETCH_SUCCESS, FETCH_FAIL],
    promise: (client) => client.get('/v2/type/' + typeId),
    id: typeId
  };
}
