import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosters } from "@/store/posters";
import { useGetPostersQuery } from "@/services/posters";
import { RootState } from "@/store";
import {
  setPosterVote,
  deletePosterVote,
  posterVotesSelectors,
  setPosterVotes,
} from "@/store/posterVotes";
import {
  useCreatePosterVoteMutation,
  useUpdatePosterVoteMutation,
  useDeletePosterVoteMutation,
  useGetPosterVotesQuery,
} from "@/services/posters";
import { PosterVotePayload } from "@/types";

export const usePosters = () => {
  const dispatch = useDispatch();
  const posters = useSelector((state: RootState) => state.posters);
  const { data, error } = useGetPostersQuery();
  const { data: votesData } = useGetPosterVotesQuery();

  useEffect(() => {
    if (data) {
      dispatch(setPosters(data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (votesData) {
      dispatch(setPosterVotes(votesData));
    }
  }, [votesData, dispatch]);

  return { posters, error };
};

export const usePosterVote = (id: number) => {
  const dispatch = useDispatch();
  const vote = useSelector((state: RootState) =>
    posterVotesSelectors.selectById(state, id)
  );
  const [createPosterVote] = useCreatePosterVoteMutation();
  const [updatePosterVote] = useUpdatePosterVoteMutation();
  const [deletePosterVoteMutation] = useDeletePosterVoteMutation();

  const hasVote = !!vote;

  const addVote = useCallback(
    (vote: PosterVotePayload) => {
      dispatch(setPosterVote(vote));
      createPosterVote(vote);
    },
    [dispatch, createPosterVote]
  );

  const updateVote = useCallback(
    (updatedVote: PosterVotePayload) => {
      dispatch(setPosterVote(updatedVote));
      updatePosterVote(updatedVote);
    },
    [dispatch, updatePosterVote]
  );

  const removeVote = useCallback(() => {
    dispatch(deletePosterVote({ id }));
    deletePosterVoteMutation({ id });
  }, [dispatch, deletePosterVoteMutation]);

  return { vote, addVote, updateVote, removeVote, hasVote };
};
