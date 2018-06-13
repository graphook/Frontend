const FETCH = 'documentation/FETCH';
const FETCH_SUCCESS = 'documentation/FETCH_SUCCESS';
const FETCH_FAIL = 'documentation/FETCH_FAIL';

const categoryOrder = ['Base Operations', 'Authentication', 'Set Operations', 'Set Item Operations', 'Type Operations', 'Other'];
const methodOrder = ['get', 'post', 'put', 'delete'];

const initialState = {
  loaded: false,
  categories: [
    {
      category: 'Introduction and Authentication',
      specialComponent: 'IntroAuth',
      subTopics: [
        { title: 'Get Your Developer Account' },
        { title: 'Understanding HTTP Requests' },
        { title: 'Understanding JSON' },
        { title: 'Using Zenow’s Request Tool' }
      ]
    },
    {
      category: 'Get Objects Tutorial',
      specialComponent: 'GetTutorial',
      subTopics: [
        { title: 'Get a Set' },
        { title: 'Get Items in a Set' },
        { title: 'Get a Type' },
      ]
    },
    {
      category: 'Search Tutorial',
      specialComponent: 'SearchTutorial',
      subTopics: [
        { title: 'Using ElasticSearch Queries' }
      ]
    },
    {
      category: 'Create a Set Tutorial',
      specialComponent: 'CreateSetTutorial',
      subTopics: [
        { title: 'Create your own Set' },
        { title: 'Add Items to a Set' },
        { title: 'Other Set Operations' }
      ]
    },
    {
      category: 'Update Objects Tutorial',
      specialComponent: 'UpdateTutorial',
      subTopics: [
        { title: 'Using Mongo Queries' }
      ]
    },
    {
      category: 'Create a Type Tutorial',
      specialComponent: 'CreateTypeTutorial',
      subTopics: [
        { title: 'Creating a Type' }
      ]
    },
  ]
};

// TODO: Add search suggestions
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case FETCH_SUCCESS:
      const routes = action.result.read.route_type;
      const newCategories = [];
      categoryOrder.forEach((categoryName) => {
        let categoryRoutes = [];
        methodOrder.forEach((methodName) => {
          categoryRoutes = categoryRoutes.concat(routes
              .filter((route) => route.category === categoryName && route.method === methodName)
              .sort((a, b) => a.path.length - b.path.length));
        });
        newCategories.push({
          category: categoryName,
          routes: categoryRoutes
        })
      });
      console.log(JSON.stringify({
        ...state,
        loaded: true,
        categories: state.categories.concat(newCategories)
      }, null, 2));
      return {
        ...state,
        loaded: true,
        categories: state.categories.concat(newCategories)
      }
    default:
      return state;
  }
}

export function fetchDocumentation() {
  return {
    types: [FETCH, FETCH_SUCCESS, FETCH_FAIL],
    promise: (client) => client.post('/v2/set/route_set/item/search', {
      params: {
        page: 0,
        count: 100
      },
      data: {}
    })
  };
}

