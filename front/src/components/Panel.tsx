import { ReactElement, useState, useEffect } from "react";
import './Panel.css'

interface Rating {
    name: string,
    value: number
}

interface Lecture {
    lecture_id: string,
    lecture_name: string
    lecturer_name: string
    ratings: Array<Rating>
    avr_rating: number | null
}


const Panel = (): ReactElement => {

    const [lectureList, setLectureList] = useState([])

    useEffect(() => {
        fetch('../test.json')
        .then(response => response.json())
        .then(data => setLectureList(data))
    }, [])    

    const [activeLectureList, setActiveLectureList] = useState([])
    const [lectureCode, setLecture] = useState('')

    const searchLecture = (code: string): void => {
        
        setLecture(code)
        const lectureCodes = lectureList.map((lecture: Lecture, _) => lecture.lecture_id)
        const activeLectureCodes = activeLectureList.map((lecture: Lecture, _) => lecture.lecture_id)

        for (const c of activeLectureCodes) {
           if (c === code) return
        }
        for (const c of lectureCodes) {
            if (c === code) {
                const lecture = lectureList.filter( (lecture: Lecture) => lecture.lecture_id === c)[0]
                setActiveLectureList([...activeLectureList, lecture])
                setLecture('')
            }
         }
    }

    return (
        <div className="Panel">
            {activeLectureList.map((item: Lecture, _) => <Lecture {...item}/>)}
            <div className="Lecture add">
                <input type="text" placeholder="Dodaj wykład..." value={lectureCode} onChange={e => searchLecture(e.target.value)}/>
            </div>
        </div>
    )
}

const Lecture = (lecture: Lecture): ReactElement => {
    return (
        <div className="Lecture">
            <div className="lecture-info">
                <div className="name">{lecture.lecture_name}</div>
                <div className="lecturer">{lecture.lecturer_name}</div>
            </div>
            <div className="rating">
                {lecture.ratings.map((item, _) => <RatingBar {...item}/>)}
            </div>
        </div>
    )
}

const RatingBar = (rating: Rating): ReactElement => {
    const [value, setValue] = useState(rating.value)
    return (
        <div className="RatingBar">
            <span>{rating.name}</span>
            <input 
                   type="range" 
                   name="rating" 
                   min={0} 
                   max={10} 
                   onChange={e => setValue(parseInt(e.target.value))} 
                   value={value}
            />
        </div>
    )
}

export default Panel