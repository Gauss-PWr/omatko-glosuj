import { useEffect } from "react";
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
  const [createLectureVote] = useCreateLectureVoteMutation();
  const [updateLectureVote] = useUpdateLectureVoteMutation();
  const [deleteLectureVoteMutation] = useDeleteLectureVoteMutation();

  const dispatch = useDispatch();
  const vote = useSelector((state: RootState) =>
    lectureVotesSelectors.selectById(state, id)
  );

  const getVote = () => {
    if (vote)
      console.log(
        "Getting Vote for ID:",
        vote.vote.merytorykaPoints,
        vote.vote.formaPoints
      );
    return vote;
  };

  const hasVote = () => {
    return vote !== undefined;
  };

  const addVote = (vote: LectureVotePayload) => {
    dispatch(setLectureVote(vote));
    createLectureVote(vote);
    console.log("Added Vote:", vote);
  };

  const updateVote = (updatedVote: LectureVotePayload) => {
    dispatch(setLectureVote(updatedVote));
    updateLectureVote(updatedVote);
    console.log("Updated Vote:", updatedVote);
  };

  const removeVote = () => {
    dispatch(deleteLectureVote({ id }));
    deleteLectureVoteMutation({ id });
  };

  return { getVote, addVote, updateVote, removeVote, hasVote };
};
