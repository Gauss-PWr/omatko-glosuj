import { useState } from "react";
import { LectureDay } from "@/types";
import useLectures from "@/components/Lectures";
import { useSwipeable, type SwipeEventData } from "react-swipeable";
import DayCard from "@/components/LecturesView/dayView";
import "./view.css";

const isInsideNoSwipe = (data: SwipeEventData, selector = ".vote") =>
  data.event instanceof Event &&
  data.event.target instanceof Element &&
  data.event.target.closest(selector) !== null;

const makeGuardedSwipe = (handler: () => void) => (data: SwipeEventData) => {
  if (isInsideNoSwipe(data)) return;
  handler();
};

const Lectures = () => {
  const [selectedDay, setSelectedDay] = useState<LectureDay | null>(null);
  const [lastDirection, setLastDirection] = useState<"left" | "right">("left");
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
    setSelectedDay(days[(dayIndex + 1) % days.length]);
  };

  const goPrevDay = () => {
    if (!days.length) return;
    setLastDirection("right");
    setSelectedDay(days[(dayIndex - 1 + days.length) % days.length]);
  };

  const handlers = useSwipeable({
    onSwipedLeft: makeGuardedSwipe(goNextDay),
    onSwipedRight: makeGuardedSwipe(goPrevDay),
    trackTouch: true,
    trackMouse: true,
  });

  return (
    <div className="lectures-view uniform-width" {...handlers}>
      <div className="lectures-change-day-container">
        <h2>{formattedDay}</h2>
      </div>
      {Object.entries(lectures).map(([day, types]) => {
        if (day !== currentDay) return null;
        return (
          <div
            key={day}
            className={`day-slide day-slide--${lastDirection}`}
            {...handlers}
          >
            <DayCard {...types} />
          </div>
        );
      })}
    </div>
  );
};

export default Lectures;
