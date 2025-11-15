import { useState } from "react";
import { LectureDay, LectureCategory, Lecture, MappedLectures } from "@/types";
import { useLectures } from "@/hooks/Lectures";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import DayCard from "@/views/Lectures/dayCard";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/virtual";
import "./view.css";

const randomLectureCategory = () =>
  Math.random() < 0.5 ? LectureCategory.STOSOWANA : LectureCategory.TEORETYCZNA;

const Lectures = () => {
  const [selectedDay, setSelectedDay] = useState<LectureDay | null>(null);
  const { lectures } = useLectures();
  const [selectedTypeForDay, setSelectedTypeForDay] = useState<
    Partial<Record<LectureDay, LectureCategory>>
  >(() => ({
    [LectureDay.DAY_1]: randomLectureCategory(),
    [LectureDay.DAY_2]: randomLectureCategory(),
    [LectureDay.DAY_3]: randomLectureCategory(),
  }));

  const mappedLectures: MappedLectures = lectures.reduce((acc, lecture) => {
    const { lectureDatetime, lectureCategory } = lecture;

    const dateKey = new Date(lectureDatetime).toISOString().split("T")[0];
    const typeKey = lectureCategory as LectureCategory;

    if (!acc[dateKey]) {
      acc[dateKey] = {} as MappedLectures[LectureDay];
    }

    if (!acc[dateKey][typeKey]) {
      acc[dateKey][typeKey] = [];
    }

    acc[dateKey][typeKey].push(lecture);
    return acc;
  }, {} as MappedLectures);

  const days = Object.keys(mappedLectures) as LectureDay[];
  const dayIndex = selectedDay ? days.indexOf(selectedDay) : 0;
  const currentDay = selectedDay ?? days[0];
  const formattedDay = currentDay
    ? new Date(currentDay).toLocaleDateString("pl-PL", { weekday: "long" })
    : "";

  return (
    <div className="lectures-view">
      <div className="lectures-change-day-container uniform-width">
        <h2>{formattedDay}</h2>
      </div>
      <div className="day-slider">
        <Swiper
          modules={[Pagination]}
          spaceBetween={50}
          slidesPerView={1}
          initialSlide={dayIndex}
          noSwipingClass="vote"
          onSlideChange={(swiper) => {
            const newDay = days[swiper.activeIndex];
            setSelectedDay(newDay);
          }}
        >
          {Object.entries(mappedLectures).map(
            (
              [day, types]: [string, Record<LectureCategory, Lecture[]>],
              index: number
            ) => (
              <SwiperSlide key={day} virtualIndex={index}>
                <DayCard
                  types={types}
                  selectedType={selectedTypeForDay[day]}
                  setType={(type: LectureCategory) =>
                    setSelectedTypeForDay((prev) => ({ ...prev, [day]: type }))
                  }
                />
              </SwiperSlide>
            )
          )}
        </Swiper>
      </div>
    </div>
  );
};

export default Lectures;
