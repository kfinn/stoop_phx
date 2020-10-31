import _ from "lodash";
import { selector } from "recoil";
import { GroupLayoutCandidate, buildLayoutCandidates } from "./groupLayoutCandidatesState";
import lobbyMembershipIdsState from "./lobbyMembershipIdsState";

const lobbyLayoutCandidatesState = selector<GroupLayoutCandidate[]>({
  key: 'lobbyLayoutCandidatesState',
  get: ({ get }) => {
    const membershipIds = get(lobbyMembershipIdsState)
    const sortedMembershipIds = _.sortBy(membershipIds)
    return buildLayoutCandidates({ groupId: null, membershipIds: sortedMembershipIds })
  }
})
export default lobbyLayoutCandidatesState
