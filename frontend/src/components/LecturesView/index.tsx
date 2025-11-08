import { useState } from "react";
import { LectureDay, LectureType } from "@/types";
import fetchLectures from "@/components/Lectures";
const Lectures = () => {
  const [selectedDay, setSelectedDay] = useState<LectureDay | null>(null);
  const [selectedType, setSelectedType] = useState<LectureType>(
    LectureType.STOSOWNA
  );

  const { lectures, error } = fetchLectures();

  return (
    <div className="lectures-view">
      <div className="choose-day-container"></div>
      <div className="lectures-type-container">
        <div className="choose-type-container"></div>
        <div className="lectures-list-container"></div> // selectedType =
        stosowana? access store and show stosowana lectures : show teoretyczna
        lectures
      </div>
    </div>
  );
};
export default Lectures;
