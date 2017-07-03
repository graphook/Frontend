const FETCH = 'profileDetails/FETCH';
const FETCH_SUCCESS = 'profileDetails/FETCH_SUCCESS';
const FETCH_FAIL = 'profileDetails/FETCH_FAIL';
const FETCH_USER_SETS = 'profileDetails/FETCH_USER_SETS';
const FETCH_USER_SETS_SUCCESS = 'profileDetails/FETCH_USER_SETS_SUCCESS';
const FETCH_USER_SETS_FAIL = 'profileDetails/FETCH_USER_SETS_FAIL';
const STAR = 'profileDetails/STAR';
const STAR_SUCCESS = 'profileDetails/STAR_SUCCESS';
const STAR_FAIL = 'profileDetails/STAR_FAIL';
const UNSTAR = 'profileDetails/UNSTAR';
const UNSTAR_SUCCESS = 'profileDetails/UNSTAR_SUCCESS';
const UNSTAR_FAIL = 'profileDetails/UNSTAR_FAIL';

import clone from 'utils/clone';

const initialState = {
  loading: false,
  loadingUserSets: false,
  error: '',
  userSetsError: '',
  sets: [],
  user: {
    stars: []
  }
};

export default function reducer(state = initialState, action = {}) {
  if (action.result && action.result.auth && action.result.auth.user) {
    return {
      ...state,
      user: action.result.auth.user
    };
  }
  let newState;
  switch (action.type) {
    case FETCH:
      return {
        ...state,
        loading: true,
        error: ''
      };
    case FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        error: '',
        user: action.result.users.read[0]
      };
    case FETCH_FAIL:
      return {
        ...state,
        loading: false
      };
    case FETCH_USER_SETS:
      return {
        ...state,
        loadingUserSets: true,
        userSetsError: ''
      };
    case FETCH_USER_SETS_SUCCESS:
      return {
        ...state,
        loadingUserSets: false,
        userSetsError: '',
        sets: action.result.sets.read.map((set) => { return set._id; })
      };
    case FETCH_USER_SETS_FAIL:
      return {
        ...state,
        loadingUserSets: false,
        userSetsError: action.error
      };
    case STAR_SUCCESS:
      newState = clone(state);
      newState.user.stars.push(action.id);
      return newState;
    case UNSTAR_SUCCESS:
      newState = clone(state);
      newState.user.stars.splice(newState.user.stars.indexOf(action.id), 1);
      return newState;
    case 'auth/LOGOUT_SUCCESS':
      return {
        ...state,
        user: initialState.user
      };
    case 'auth/LOGIN_SUCCESS':
      return {
        ...state,
        user: action.result
      };
    default:
      return state;
  }
}

export function fetchUser() {
  return {
    types: [FETCH, FETCH_SUCCESS, FETCH_FAIL],
    promise: (client) => client.get('/v2/user')
  };
}
export function fetchUserSets(username) {
  return {
    types: [FETCH_USER_SETS, FETCH_USER_SETS_SUCCESS, FETCH_USER_SETS_FAIL],
    promise: (client) => client.post('/v1/set/search', {
      data: {
        'creator.username': username
      }
    })
  };
}
export function star(setId) {
  return {
    types: [STAR, STAR_SUCCESS, STAR_FAIL],
    promise: (client) => client.put('/v2/set/' + setId + '/star'),
    id: setId
  };
}
export function unstar(setId) {
  return {
    types: [UNSTAR, UNSTAR_SUCCESS, UNSTAR_FAIL],
    promise: (client) => client.put('/v2/set/' + setId + '/unstar'),
    id: setId
  };
}
