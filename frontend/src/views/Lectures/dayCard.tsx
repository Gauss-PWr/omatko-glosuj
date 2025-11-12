import { LectureCategory, Lecture } from "@/types";
import LectureCard from "@/components/Card/lecture";
import "./day.view.css";

const DayCard = ({
  types,
  selectedType,
  setType,
}: {
  types: Record<LectureCategory, Lecture[]>;
  selectedType: LectureCategory | undefined;
  setType: (type: LectureCategory) => void;
}) => {
  return (
    <div className="lecture-day-container">
      <div className="lecture-choose-type-container">
        <button
          className={
            LectureCategory.STOSOWANA === selectedType ? "active-stosowana" : ""
          }
          onClick={() => setType(LectureCategory.STOSOWANA)}
        >
          stosowana
        </button>
        <button
          className={
            LectureCategory.TEORETYCZNA === selectedType
              ? "active-teoretyczna"
              : ""
          }
          onClick={() => setType(LectureCategory.TEORETYCZNA)}
        >
          teoretyczna
        </button>
      </div>
      <div className="lectures-type-container">
        {Object.entries(types).map(([type, list]) => {
          if (type !== selectedType) return null;
          const sortedList = [...list].sort(
            (a, b) =>
              new Date(a.lectureDatetime).getTime() -
              new Date(b.lectureDatetime).getTime()
          );
          return (
            <div key={type} className="lectures-list-container">
              {sortedList.map((lecture) => (
                <LectureCard key={lecture.lectureId} {...lecture} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DayCard;
