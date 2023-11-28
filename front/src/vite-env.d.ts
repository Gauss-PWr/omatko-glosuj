/// <reference types="vite/client" />



type PosterParser = (poster: PosterResponse[]) => Presentation[]
type LectureParser = (poster: LectureResponse[]) => Presentation[]


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
  lecture_id: number,
  lecture_name: string
  lecturer_name: string
  ratings: Array<Rating>
}

interface LectureResponse {
  lecture_id: number,
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

interface Presentation {
  id: number,
  title: string,
  name: string,
  rating: Rating[]
}

interface PosterResponse {
  poster_id: number,
  poster_name: string,
  poster_author: string,
  vote_merytoryka: number,
  vote_estetyka: number
}


interface GetDataOptions {
  data_name: string,
  url: string,
  setter: React.Dispatch<React.SetStateAction<Presentation[]>>,
  parser: LectureParser | PosterParser
}

interface ItemProp {
  items: Presentation[]
}
interface ItemPropSetter extends ItemProp{
  setter: React.Dispatch<React.SetStateAction<Presentation[]>>,
}