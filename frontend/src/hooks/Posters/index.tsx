import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosters } from "@/store/posters";
import { useGetPostersQuery } from "@/services/posters";
import { RootState } from "@/store";
import {
  setPosterVotes,
  setPosterVote,
  deletePosterVote,
} from "@/store/posterVotes";
import {
  useGetPosterVotesQuery,
  useCreatePosterVoteMutation,
  useUpdatePosterVoteMutation,
  useDeletePosterVoteMutation,
} from "@/services/posters";
import { PosterVotePayload } from "@/types";

export const usePosters = () => {
  const dispatch = useDispatch();
  const posters = useSelector((state: RootState) => state.posters);
  const { data, error } = useGetPostersQuery();

  useEffect(() => {
    if (data) {
      dispatch(setPosters(data));
    }
  }, [data, dispatch]);

  return { posters, error };
};

export const usePosterVotes = () => {
  const dispatch = useDispatch();
  const votes = useSelector((state: RootState) => state.posterVotes);
  const { data } = useGetPosterVotesQuery();
  const [createPosterVote] = useCreatePosterVoteMutation();
  const [updatePosterVote] = useUpdatePosterVoteMutation();
  const [deletePosterVoteMutation] = useDeletePosterVoteMutation();

  useEffect(() => {
    if (data) {
      dispatch(setPosterVotes(data));
    }
  }, [data, dispatch]);

  const getVote = (posterId: number) => {
    return votes.find((vote: PosterVotePayload) => vote.posterId === posterId);
  };

  const hasVote = (posterId: number) => {
    return votes.some((vote: PosterVotePayload) => vote.posterId === posterId);
  };

  const addVote = (vote: PosterVotePayload) => {
    dispatch(setPosterVote(vote));
    createPosterVote(vote);
  };

  const updateVote = (updatedVote: PosterVotePayload) => {
    dispatch(setPosterVote(updatedVote));
    updatePosterVote(updatedVote);
  };

  const removeVote = (posterId: number) => {
    dispatch(deletePosterVote({ posterId }));
    deletePosterVoteMutation({ posterId });
  };

  return { getVote, addVote, updateVote, removeVote, hasVote };
};
