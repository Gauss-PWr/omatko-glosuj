import { useState } from "react";
import { LectureDay } from "@/types";
import { useLectures } from "@/hooks/Lectures";
import { useSwipeable, type SwipeEventData } from "react-swipeable";
import SwipeIndicator from "@/components/SwipeIndicator";
import DayCard from "@/views/Lectures/dayCard";
import "./view.css";

const isInsideNoSwipe = (
  data: SwipeEventData,
  selector = ".vote, input[type='range']"
) =>
  data.event instanceof Event &&
  data.event.target instanceof Element &&
  data.event.target.closest(selector) !== null;

const SWIPE_THRESHOLD = 100; // pixels to trigger swipe

const Lectures = () => {
  const [selectedDay, setSelectedDay] = useState<LectureDay | null>(null);
  const [lastDirection, setLastDirection] = useState<"left" | "right">("left");
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isChangingDay, setIsChangingDay] = useState(false);
  const { lectures } = useLectures();

  const days = Object.keys(lectures) as LectureDay[];
  const dayIndex = selectedDay ? days.indexOf(selectedDay) : 0;
  const currentDay = selectedDay ?? days[0];
  const formattedDay = currentDay
    ? new Date(currentDay).toLocaleDateString("pl-PL", { weekday: "long" })
    : "";

  const goNextDay = () => {
    if (!days.length) return;
    setLastDirection("left");
    setIsChangingDay(true);
    setSelectedDay(days[(dayIndex + 1) % days.length]);
    setTimeout(() => setIsChangingDay(false), 220);
  };

  const goPrevDay = () => {
    if (!days.length) return;
    setLastDirection("right");
    setIsChangingDay(true);
    setSelectedDay(days[(dayIndex - 1 + days.length) % days.length]);
    setTimeout(() => setIsChangingDay(false), 220);
  };

  const handlers = useSwipeable({
    onSwiping: (data) => {
      if (isInsideNoSwipe(data)) return;
      setIsDragging(true);
      const maxDrag = 300;
      const dampening = 0.5;
      const offset = data.deltaX * dampening;
      setDragOffset(Math.max(-maxDrag, Math.min(maxDrag, offset)));
    },
    onSwiped: (data) => {
      if (isInsideNoSwipe(data)) return;

      const swipeDistance = Math.abs(data.deltaX);

      if (swipeDistance >= SWIPE_THRESHOLD) {
        if (data.deltaX < 0) {
          goNextDay();
        } else {
          goPrevDay();
        }
      }

      setDragOffset(0);
      setIsDragging(false);
    },
    trackTouch: true,
    trackMouse: true,
  });

  return (
    <div className="lectures-view uniform-width" {...handlers}>
      <div className="lectures-change-day-container">
        <h2>{formattedDay}</h2>
      </div>
      <SwipeIndicator currentIndex={dayIndex} totalDays={days.length} />
      {Object.entries(lectures).map(([day, types]) => {
        if (day !== currentDay) return null;
        return (
          <div
            key={day}
            className={`day-slide ${
              isChangingDay ? `day-slide--${lastDirection}` : ""
            }`}
            style={{
              transform: isDragging ? `translateX(${dragOffset}px)` : undefined,
              transition: isDragging ? "none" : "transform 0.3s ease-out",
            }}
          >
            <DayCard {...types} />
          </div>
        );
      })}
    </div>
  );
};

export default Lectures;
