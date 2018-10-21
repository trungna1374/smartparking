const initialState = { parks: [] }


const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INITIAL_PARK_DATA':
      return {
        ...state,
        parks: action.parks
      }
    default:
      return state
  }
}


export default reducer