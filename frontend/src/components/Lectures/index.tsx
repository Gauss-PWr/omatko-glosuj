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
      console.log(data);
    }
  }, [data, dispatch]);

  return { lectures, error };
};

export default fetchLectures;
