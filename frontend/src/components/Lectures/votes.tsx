import {
  useGetLectureVotesQuery,
  useCreateLectureVoteMutation,
  useUpdateLectureVoteMutation,
  useDeleteLectureVoteMutation,
} from "@/services/lectures";
import { useDispatch, useSelector } from "react-redux";
import { LectureVote } from "@/types";
import { useEffect } from "react";
import {
  setLectureVotes,
  setLectureVote,
  deleteLectureVote,
} from "@/store/lectureVotes";
import { RootState } from "@/store";

const useLectureVotes = () => {
  const dispatch = useDispatch();
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
    const votes = useSelector((state: RootState) => state.lectureVotes);
    return votes.find((vote: LectureVote) => vote.lectureId === lectureId);
  };

  const addVote = (vote: LectureVote) => {
    if (!data) return;
    dispatch(setLectureVote(vote));
    createLectureVote(vote);
  };

  const updateVote = (updatedVote: LectureVote) => {
    if (!data) return;

    const index = data.findIndex(
      (vote) => vote.lectureId === updatedVote.lectureId
    );
    if (index !== -1) {
      data[index] = updatedVote;
      dispatch(setLectureVote(updatedVote));
      updateLectureVote(updatedVote);
    }
  };

  const removeVote = (lectureId: number) => {
    if (!data) return;

    const index = data.findIndex((vote) => vote.lectureId === lectureId);
    if (index !== -1) {
      data.splice(index, 1);
      dispatch(deleteLectureVote({ lectureId }));
      deleteLectureVoteMutation({ lectureId });
    }
  };

  return { getVote, addVote, updateVote, removeVote };
};

export default useLectureVotes;
