import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLectures } from "@/store/lectures";
import { useGetLecturesQuery } from "@/services/lectures";
import { RootState } from "@/store";
import {
  useGetLectureVotesQuery,
  useCreateLectureVoteMutation,
  useUpdateLectureVoteMutation,
  useDeleteLectureVoteMutation,
} from "@/services/lectures";
import { LectureVotePayload } from "@/types";
import {
  setLectureVotes,
  setLectureVote,
  deleteLectureVote,
  lectureVotesSelectors,
} from "@/store/lectureVotes";

export const useLectures = () => {
  const dispatch = useDispatch();
  const lectures = useSelector((state: RootState) => state.lectures);
  const { data, error } = useGetLecturesQuery();
  const { data: votesData } = useGetLectureVotesQuery();

  useEffect(() => {
    if (!data) return;
    dispatch(setLectures(data));
    if (votesData) {
      dispatch(setLectureVotes(votesData));
    }
  }, [data, votesData, dispatch]);

  return { lectures, error };
};

export const useLectureVote = (id: number) => {
  const dispatch = useDispatch();
  const vote = useSelector((state: RootState) =>
    lectureVotesSelectors.selectById(state, id)
  );

  const [createLectureVote] = useCreateLectureVoteMutation();
  const [updateLectureVote] = useUpdateLectureVoteMutation();
  const [deleteLectureVoteMutation] = useDeleteLectureVoteMutation();

  const hasVote = !!vote;

  const addVote = useCallback(
    (v: LectureVotePayload) => {
      // optimistic local update
      dispatch(setLectureVote(v));
      createLectureVote(v);
    },
    [dispatch, createLectureVote]
  );

  const updateVote = useCallback(
    (v: LectureVotePayload) => {
      dispatch(setLectureVote(v));
      updateLectureVote(v);
    },
    [dispatch, updateLectureVote]
  );

  const removeVote = useCallback(() => {
    dispatch(deleteLectureVote({ id }));
    deleteLectureVoteMutation({ id });
  }, [dispatch, deleteLectureVoteMutation, id]);

  return { vote, hasVote, addVote, updateVote, removeVote };
};
