import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLectures } from "@/store/lectures";
import { LectureDay, LectureCategory } from "@/types";
import { LecturesState } from "@/types/states";
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
} from "@/store/lectureVotes";

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
    return votes.find(
      (vote: LectureVotePayload) => vote.lectureId === lectureId
    );
  };

  const hasVote = (lectureId: number) => {
    return votes.some(
      (vote: LectureVotePayload) => vote.lectureId === lectureId
    );
  };

  const addVote = (vote: LectureVotePayload) => {
    dispatch(setLectureVote(vote));
    createLectureVote(vote);
  };

  const updateVote = (updatedVote: LectureVotePayload) => {
    dispatch(setLectureVote(updatedVote));
    updateLectureVote(updatedVote);
  };

  const removeVote = (lectureId: number) => {
    dispatch(deleteLectureVote({ lectureId }));
    deleteLectureVoteMutation({ lectureId });
  };

  return { getVote, addVote, updateVote, removeVote, hasVote };
};
