import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLectures } from "@/store/lectures";
import { LectureDay, LecturesState, LectureType } from "@/types";
import { useGetLecturesQuery } from "@/services/lectures";
import { RootState } from "@/store";

const useLectures = () => {
  const dispatch = useDispatch();
  const lectures = useSelector((state: RootState) => state.lectures);
  const { data, error } = useGetLecturesQuery();

  useEffect(() => {
    if (!data) return;

    const dayTypeMap: LecturesState = data.reduce((acc, lecture) => {
      const { lectureDatetime, lectureCategory } = lecture;

      const dateKey = new Date(lectureDatetime).toISOString();
      const typeKey = lectureCategory as LectureType;

      if (!acc[dateKey]) {
        acc[dateKey] = {} as LecturesState[LectureDay];
      }

      if (!acc[dateKey][typeKey]) {
        acc[dateKey][typeKey] = [];
      }

      acc[dateKey][typeKey].push(lecture);
      return acc;
    }, {} as LecturesState);

    dispatch(setLectures(dayTypeMap));
  }, [data, dispatch]);

  return { lectures, error };
};

export default useLectures;
