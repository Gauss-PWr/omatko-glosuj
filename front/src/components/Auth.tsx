import {createContext, useContext, useReducer, ReactNode} from 'react'

export interface User {
    login: string,
    password: string,
    token?: Token
  }

interface Token {
  accessToken: 'string',
  tokenType: 'string'
}

interface LoginAction {
  type:  'LOGIN' | 'LOGOUT',
  payload: User
}
  
export interface Auth {
    user: User | null,
    isAuntheticated: boolean
  }
  
const initialAuth: Auth = {
    user: null,
    isAuntheticated: false
  }

  interface AuthProviderProps {
    children: ReactNode
  }
  
  
  const AuthContext = createContext<{ state: Auth; dispatch: React.Dispatch<LoginAction> } | undefined>(undefined);
  
  const authReducer = (state: Auth, action: LoginAction)=> {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                isAuntheticated: true,
                user: action.payload
            }
        case 'LOGOUT':
            return {
                ...state,
                isAuntheticated: false,
                user: null
            }
        default:
            return state
    }
  }

const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, initialAuth)

    return (
        <AuthContext.Provider value={{state, dispatch}}>
           {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context
}

export {AuthProvider, useAuth}