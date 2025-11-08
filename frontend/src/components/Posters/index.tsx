import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLectures } from "@/store/lectures";
import { LectureDay, LectureType } from "@/types";
import {
  useGetLecturesQuery,
  useGetLectureVotesQuery,
  useCreateLectureVoteMutation,
  useUpdateLectureVoteMutation,
} from "@/services/lectures";
import { RootState } from "@/store";

const fetchLectures = () => {
  const dispatch = useDispatch();
  const lectures = useSelector((state: RootState) => state.lectures);
  const { data, error } = useGetLecturesQuery();

  useEffect(() => {
    if (data) {
      dispatch(
        setLectures({
          day: LectureDay.DAY_1,
          type: LectureType.STOSOWNA,
          lectures: data,
        })
      );
    }
  }, [data, dispatch]);

  return { error };
};
