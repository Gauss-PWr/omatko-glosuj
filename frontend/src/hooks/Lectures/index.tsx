import { useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLectures } from "@/store/lectures";
import { RootState } from "@/store";
import {
  useGetLecturesQuery,
  useGetLectureVotesQuery,
  useCreateLectureVoteMutation,
  useUpdateLectureVoteMutation,
  useDeleteLectureVoteMutation,
} from "@/services/lectures";
import { LectureVotePayload } from "@/types";

export const useLectures = () => {
  const dispatch = useDispatch();
  const lectures = useSelector((state: RootState) => state.lectures);
  const { data, error } = useGetLecturesQuery();

  useEffect(() => {
    if (!data) return;
    dispatch(setLectures(data));
  }, [data, dispatch]);

  return { lectures, error };
};

export const useLectureVote = (id: number) => {
  const { data: votes } = useGetLectureVotesQuery();
  const vote = useMemo(
    () => votes?.find((lectureVote) => lectureVote.id === id),
    [votes, id]
  );

  const [createLectureVote] = useCreateLectureVoteMutation();
  const [updateLectureVote] = useUpdateLectureVoteMutation();
  const [deleteLectureVoteMutation] = useDeleteLectureVoteMutation();

  const hasVote = !!vote;

  const addVote = useCallback(
    (v: LectureVotePayload) => {
      createLectureVote(v);
    },
    [createLectureVote]
  );

  const updateVote = useCallback(
    (v: LectureVotePayload) => {
      updateLectureVote(v);
    },
    [updateLectureVote]
  );

  const removeVote = useCallback(() => {
    deleteLectureVoteMutation({ id });
  }, [deleteLectureVoteMutation, id]);

  return { vote, hasVote, addVote, updateVote, removeVote };
};
