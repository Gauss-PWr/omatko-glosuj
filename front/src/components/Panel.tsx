import { ReactElement, useState, useEffect } from "react";
import './Panel.css'
import axios from "axios";
import { Auth, useAuth } from "./Auth";

const URL = 'http://localhost:5555'


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
    vote_merytoryka: number | null,
    vote_forma: number | null
}

const parseLectures = (lectures) => lectures.map((lecture: LectureResponse) => 
({
    lecture_id: lecture.lecture_id,
    lecture_name: lecture.lecture_name,
    lecturer_name: lecture.speaker_name,
    ratings: [
        {
            name: 'merytoryka',
            value: lecture.vote_merytoryka !== null? lecture.vote_merytoryka : -1 
        },
        {
            name: 'forma',
            value: lecture.vote_merytoryka !== null? lecture.vote_forma : -1 
        }
    ]
})
)

const getLectures = async (state: Auth, setter: React.Dispatch<React.SetStateAction<Lecture[]>> ) => {
    const res = await axios.get(URL + '/lectures/user/lectures', {
        headers: {
            'Authorization': `${state.user?.token?.tokenType} ${state.user?.token?.accessToken}`,
            'Accept': 'application/json'                

        }
    } )
    
    if (await res.status === 200) {
        setter(parseLectures(res.data.lectures))
    }
  }






const Panel = (): ReactElement => {

    const {state, dispatch} = useAuth()
    const [activeLectureList, setActiveLectureList] = useState<Lecture[]>([])
    const [lectureCode, setLecture] = useState('')
    
    useEffect(() =>  { getLectures(state, setActiveLectureList) }, [])    


    const searchLecture = async (code: string): Promise<void> => {
        
        setLecture(code)
        if ( code.length !== 4)
            return
        try {
            const res = await axios.post(URL + '/lectures/add-to-user', {'lecture_code': code}, {
                headers: {
                    'Authorization': `${state.user?.token?.tokenType} ${state.user?.token?.accessToken}`,
                    'Accept': 'application/json'                
    
                }
            })

            if (await res.status === 200){
                getLectures(state, setActiveLectureList)
            }
        } catch (error) {
            console.log(error)
        }
         
        
    }

    return (
        <div className="Panel">
            {activeLectureList.map((item: Lecture, _) => <Lecture key={item.lecture_id} {...item}/>)}
            <div className="Lecture add">
                <input type="text" placeholder="Dodaj wykład..." value={lectureCode} onChange={e => searchLecture(e.target.value)}/>
            </div>
        </div>
    )
}

const Lecture = (lecture: Lecture): ReactElement => {
    const {state, dispatch} = useAuth()
    const [ratings, setRatings] = useState(lecture.ratings)

    const handleRatingChange = (index: number, newValue: number) => {
        const updatedRatings = [...ratings];
        updatedRatings[index] = { ...updatedRatings[index], value: newValue };
        setRatings(updatedRatings);
    }

    useEffect( () => {
        const updateRatings = async () => {
            try {
                const res = await axios.put(URL + `/lectures/votes/${lecture.lecture_id}`, {
                    'merytoryka_points': ratings[0].value === -1? null : ratings[0].value ,
                    'forma_points': ratings[1].value === -1? null : ratings[1].value,
                },
                {
                  headers: {
                        'Authorization': `${state.user?.token?.tokenType} ${state.user?.token?.accessToken}`,
                        'Accept': 'application/json'                
        
                }} 
                )

                if (await res.status === 200) {
                    console.log('git')
                }
            } catch (error) {
                console.log(error);
                
            }
        }
        const timeoutId = setTimeout(() => { updateRatings() }, 1500)
        return () => clearTimeout(timeoutId)
    }, [ratings, lecture.lecture_id, state.user?.token?.tokenType, state.user?.token?.accessToken])

    return (
        <div className="Lecture">
            <div className="lecture-info">
                <div className="name">{lecture.lecture_name}</div>
                <div className="lecturer">{lecture.lecturer_name}</div>
            </div>
            <div className="rating">
            {ratings.map((item, index) => (
                <RatingBar key={index} {...item} onRatingChange={(newValue) => handleRatingChange(index, newValue)} />
            ))}
            </div>
        </div>
    )
}

//react.useCallback

const RatingBar = (rating: Rating & { onRatingChange: (newValue: number) => void }): ReactElement => {
    return (
        <div className="RatingBar">
            <span>{rating.name}</span>
            <input 
                   type="range" 
                   name="rating" 
                   min={0} 
                   max={10} 
                   onChange={e => rating.onRatingChange(parseInt(e.target.value))} 
                   value={rating.value}
            />
        </div>
    )
}

export default Panel