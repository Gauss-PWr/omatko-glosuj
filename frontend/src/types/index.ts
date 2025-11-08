export type User = {
    username: string
}
export type AuthState = {
    authenticated: boolean
}


export type Lecture = {
    lectureId: number
    lectureCategory: string
    lectureName: string
    speakerName: string
    lectureDatetime: string
}

export type Poster = {
    posterId: number
    posterName: string
    posterAuthor: string
}

export type LectureRequest = {
    lectureId: number
}

export type PosterRequest = {
    posterId: number
}

export type VoteLectureRequest = {
    merytorykaPoints?: number | null
    formaPoints?: number | null
}


export type VotePosterRequest = {
    merytorykaPoints?: number | null
    estetykaPoints?: number | null
}