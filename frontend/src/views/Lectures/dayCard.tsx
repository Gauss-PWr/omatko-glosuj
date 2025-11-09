import { useState } from "react";
import { LectureDay, LectureType, Lecture } from "@/types";
import LectureCard from "@/components/Card/lecture";
import "./day.view.css";

const DayCard = (types: Record<LectureType, Lecture[]>) => {
  const [selectedType, setSelectedType] = useState<LectureType>(
    LectureType.STOSOWANA
  );

  return (
    <div className="lecture-day-container">
      <div className="lecture-choose-type-container">
        <button
          className={
            LectureType.STOSOWANA === selectedType ? "active-stosowana" : ""
          }
          onClick={() => setSelectedType(LectureType.STOSOWANA)}
        >
          stosowana
        </button>
        <button
          className={
            LectureType.TEORETYCZNA === selectedType ? "active-teoretyczna" : ""
          }
          onClick={() => setSelectedType(LectureType.TEORETYCZNA)}
        >
          teoretyczna
        </button>
      </div>
      <div className="lectures-type-container">
        {Object.entries(types).map(
          ([type, list]) =>
            type === selectedType && (
              <div key={type} className="lectures-list-container">
                {list.map((lecture) => (
                  <LectureCard key={lecture.lectureId} {...lecture} />
                ))}
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default DayCard;
