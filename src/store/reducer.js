const defaultBoardSize = 5

const setStateReducer = (state=defaultBoardSize, action) => {

  const {
    board
  } = action

  switch (action.type) {
    case 'SET_BOARD':
      return {...state,  board}
    default:
      return state;
  }
}

export default setStateReducer
