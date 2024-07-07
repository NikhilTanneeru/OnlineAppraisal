const initialState = {
  user: null,
  error: null,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.userData, error: null };
    case 'LOGIN_FAILURE':
      return { ...state, error: action.error };
    case 'GET_USER_SUCCESS':
      return { ...state, user: action.userData, error: null };
    case 'GET_USER_FAILURE':
      return { ...state, error: action.error };
    default:
      return state;
  }
}