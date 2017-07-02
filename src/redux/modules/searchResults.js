const SEARCH = 'setSearch/SEARCH';
const SEARCH_SUCCESS = 'setSearch/SEARCH_SUCCESS';
const SEARCH_FAIL = 'setSearch/SEARCH_FAIL';

const NUM_PER_PAGE = 20;
const initialState = {
  loaded: false,
  page: 0,
  loading: false,
  results: [],
  allResultsLoaded: false,
  curSearch: ''
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SEARCH:
      return {
        ...state,
        results: (action.query !== state.curSearch) ? [] : state.results,
        loading: true,
        error: undefined
      };
    case SEARCH_SUCCESS:
      const resultIds = Object.keys(action.result.read).reduce((aggs, typeKey) => {
        return aggs.concat(action.result.read[typeKey].map((obj) => obj._id));
      }, []);
      return {
        ...state,
        loading: false,
        loaded: true,
        results: (action.page !== 0) ? state.results.concat(resultIds) : resultIds,
        page: action.page,
        curSearch: action.query,
        allResultsLoaded: resultIds.length < NUM_PER_PAGE
      };
    case SEARCH_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        curSearch: action.query,
        error: action.error
      };
    default:
      return state;
  }
}

export function search(searchQuery, pageNumber = 0, setName, name) {
  return {
    types: [SEARCH, SEARCH_SUCCESS, SEARCH_FAIL],
    promise: (client) => client.post('/v2/set/' + setName + '/item/search', {
      params: {
        page: pageNumber,
        count: NUM_PER_PAGE
      },
      data: (searchQuery !== '') ? {
        query: {
          match: {
            _all: searchQuery
          }
        }
      } : {}
    }),
    query: searchQuery,
    page: pageNumber,
    name: name
  };
}
