import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLectures } from "@/store/lectures";
import { LectureDay, LecturesState, LectureType } from "@/types";
import { useGetLecturesQuery } from "@/services/lectures";
import { RootState } from "@/store";
import {
  useGetLectureVotesQuery,
  useCreateLectureVoteMutation,
  useUpdateLectureVoteMutation,
  useDeleteLectureVoteMutation,
} from "@/services/lectures";
import { LectureVote } from "@/types";
import {
  setLectureVotes,
  setLectureVote,
  deleteLectureVote,
} from "@/store/lectureVotes";

export const useLectures = () => {
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

export const useLectureVotes = () => {
  const dispatch = useDispatch();
  const votes = useSelector((state: RootState) => state.lectureVotes);
  const { data } = useGetLectureVotesQuery();
  const [createLectureVote] = useCreateLectureVoteMutation();
  const [updateLectureVote] = useUpdateLectureVoteMutation();
  const [deleteLectureVoteMutation] = useDeleteLectureVoteMutation();

  useEffect(() => {
    if (data) {
      dispatch(setLectureVotes(data));
    }
  }, [data, dispatch]);

  const getVote = (lectureId: number) => {
    return votes.find((vote: LectureVote) => vote.lectureId === lectureId);
  };

  const hasVote = (lectureId: number) => {
    return votes.some((vote: LectureVote) => vote.lectureId === lectureId);
  };

  const addVote = (vote: LectureVote) => {
    dispatch(setLectureVote(vote));
    createLectureVote(vote);
  };

  const updateVote = (updatedVote: LectureVote) => {
    dispatch(setLectureVote(updatedVote));
    updateLectureVote(updatedVote);
  };

  const removeVote = (lectureId: number) => {
    dispatch(deleteLectureVote({ lectureId }));
    deleteLectureVoteMutation({ lectureId });
  };

  return { getVote, addVote, updateVote, removeVote, hasVote };
};
