const IS_VALID = 'form/IS_VALID';
const IS_VALID_SUCCESS = 'form/IS_VALID_SUCCESS';
const IS_VALID_FAIL = 'form/IS_VALID_FAIL';

const initialState = {
  saveError: null,
};

export default function reducer(state = initialState, action = {}) {
  console.log(action);
  switch (action.type) {
    case IS_VALID:
      return state; // 'saving' flag handled by redux-form
    case IS_VALID_SUCCESS:
      const data = [...state.data];
      data[action.result.id - 1] = action.result;
      return {
        ...state,
        data: data,
        saveError: null,
      };
    case IS_VALID_FAIL:
      return typeof action.error === 'string' ? {
        ...state,
        saveError: action.error
      } : state;
    default:
      return state;
  }
}

export function isValid(collection, data) {
  return {
    types: [IS_VALID, IS_VALID_SUCCESS, IS_VALID_FAIL],
    promise: (client) => client.post('/v1/' + collection + '/validate', {
      data
    })
  };
}