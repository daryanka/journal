/// Types
type User = {
  email: string
  id: number
}

export const NEW_USER = "NEW_USER"
export const CLEAR_USER = "CLEAR_USER"

type NewUser =  {
  type: typeof NEW_USER,
  payload: User
}

type ClearUser = {
  type: typeof CLEAR_USER
}

type ActionTypes = NewUser | ClearUser
/// END Types


interface AuthReducerState {
  loggedIn: boolean
  user?: User
}

const defaultAuthState: AuthReducerState = {
  loggedIn: false
}

const authReducer = (state: AuthReducerState = defaultAuthState, action: ActionTypes) => {
  switch (action.type) {
    case CLEAR_USER:
      return defaultAuthState
    case NEW_USER:
      return {
        loggedIn: true,
        user: action.payload
      }
  }
  return state
}

export default authReducer