import type {SetVoteDeadlineResult, RemoveVoteDealineResult} from '$lib/server/services/admin/admin.repository.types'

export interface AdminRepository {
    setVoteDedline(timestamp: number): SetVoteDeadlineResult
    removeVoteDeadline(): RemoveVoteDealineResult
}
