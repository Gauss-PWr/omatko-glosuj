import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosters } from "@/store/posters";
import { useGetPostersQuery } from "@/services/posters";
import { RootState } from "@/store";
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

  useEffect(() => {
    if (data) {
      dispatch(setPosters(data));
    }
  }, [data, dispatch]);

  return { posters, error };
};

export const usePosterVote = (id: number) => {
  const { data: votes } = useGetPosterVotesQuery();
  const vote = useMemo(
    () => votes?.find((posterVote) => posterVote.id === id),
    [votes, id]
  );
  const [createPosterVote] = useCreatePosterVoteMutation();
  const [updatePosterVote] = useUpdatePosterVoteMutation();
  const [deletePosterVoteMutation] = useDeletePosterVoteMutation();

  const hasVote = !!vote;

  const addVote = useCallback(
    (vote: PosterVotePayload) => {
      createPosterVote(vote);
    },
    [createPosterVote]
  );

  const updateVote = useCallback(
    (updatedVote: PosterVotePayload) => {
      updatePosterVote(updatedVote);
    },
    [updatePosterVote]
  );

  const removeVote = useCallback(() => {
    deletePosterVoteMutation({ id });
  }, [deletePosterVoteMutation, id]);

  return { vote, addVote, updateVote, removeVote, hasVote };
};
