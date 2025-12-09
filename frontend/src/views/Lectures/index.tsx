import { useState, useEffect, useRef } from "react";
import { LectureDay, LectureCategory, Lecture, MappedLectures } from "@/types";
import { useLectures } from "@/hooks/Lectures";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, FreeMode, Thumbs } from "swiper/modules";
import DayCard from "@/views/Lectures/dayCard";
import { Swiper as SwiperInstance } from "swiper/types";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/virtual";
import "swiper/css/thumbs";
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

  const days = Object.keys(mappedLectures).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  ) as LectureDay[];
  const swiperRef = useRef<SwiperInstance | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperInstance | null>(null);

  useEffect(() => {
    if (!selectedDay && days.length > 0) {
      const todayKey = new Date().toISOString().split("T")[0];
      const dayToSelect = days.find((d) => d === todayKey) ?? days[0] ?? null;
      if (dayToSelect) setSelectedDay(dayToSelect);
    }
  }, [days, selectedDay]);

  const dayIndex =
    selectedDay && days.length ? Math.max(days.indexOf(selectedDay), 0) : 0;

  useEffect(() => {
    if (!swiperRef.current) return;
    swiperRef.current.slideTo(dayIndex, 0);
  }, [dayIndex]);

  const currentDay = selectedDay ?? days[0];
  const formattedDay = currentDay
    ? new Date(currentDay).toLocaleDateString("pl-PL", { weekday: "long" })
    : "";

  return (
    <div className="lectures-view">
      <div className="lectures-change-day-container uniform-width">
        <Swiper
          modules={[FreeMode, Thumbs]}
          onSwiper={setThumbsSwiper}
          slidesPerView={Math.min(days.length, 4)}
          spaceBetween={12}
          freeMode
          watchSlidesProgress
          className="lectures-thumbs"
        >
          {days.map((day) => {
            const date = new Date(day);
            const label = date.toLocaleDateString("pl-PL", {
              weekday: "long",
            });
            const isActive = day === currentDay;
            return (
              <SwiperSlide
                key={day}
                className={`lectures-thumbs__slide ${
                  isActive ? "active-day" : ""
                }`}
                onClick={() => setSelectedDay(day)}
              >
                <span>{label}</span>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      <div className="day-slider">
        <Swiper
          modules={[Pagination, Thumbs]}
          spaceBetween={50}
          slidesPerView={1}
          initialSlide={dayIndex}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          noSwipingClass="vote"
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            const newDay = days[swiper.activeIndex];
            setSelectedDay(newDay);
          }}
        >
          {days.map((day, index) => {
            const types =
              mappedLectures[day] || ({} as Record<LectureCategory, Lecture[]>);
            return (
              <SwiperSlide key={day} virtualIndex={index}>
                <DayCard
                  types={types}
                  selectedType={selectedTypeForDay[day]}
                  setType={(type: LectureCategory) =>
                    setSelectedTypeForDay((prev) => ({ ...prev, [day]: type }))
                  }
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default Lectures;
