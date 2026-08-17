import type { Result } from '$lib/core/result';

type SetVoteDeadlineSuccess = {
    endsAt: number
}

type SetVoteDeadlineFailure = {
    code: 'INVALID_VALUE',
    message: string
}

export type SetVoteDeadlineResult = Result<SetVoteDeadlineSuccess, SetVoteDeadlineFailure>


type RemoveVoteDeadlineSuccess = {}

type RemoveVoteDeadlineFailure = {
    code: 'TIMESTAMP_ALREADY_NULL',
}

export type RemoveVoteDeadlineResult = Result<RemoveVoteDeadlineSuccess, RemoveVoteDeadlineFailure>
