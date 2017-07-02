
const initialState = {};

export default function reducer(state = initialState, action = {}) {
  if (action.result) {
    const methods = ([action.result.read || {}]);
    methods.push(action.result.created || {});
    methods.push(action.result.updated || {});
    methods.forEach((method) => {
      Object.keys(method).forEach((typeKey) => {
        if (!state[typeKey]) {
          state[typeKey] = {};
        }
        method[typeKey].forEach((obj) => {
          state[typeKey][obj._id] = obj;
        });
      });
    });
  }
  return state;
}
