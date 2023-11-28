/// <reference types="vite/client" />

interface ImportMetaEnv extends Readonly<Record<string, string | boolean | undefined>> {
    readonly VITE_APP_API_BASE_URL: string
  }
  
interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Rating {
  name: string,
  value: number
}

interface Lecture {
  lecture_id: string,
  lecture_name: string
  lecturer_name: string
  ratings: Array<Rating>
}

interface LectureResponse {
  lecture_id: string,
  lecture_name: string
  speaker_name: string,
  vote_merytoryka: number
  vote_forma: number
}

interface User {
  username: string,
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

interface Auth {
  user: User | null,
  isAuntheticated: boolean
}

interface AuthProviderProps {
  children: ReactNode
}