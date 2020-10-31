import _ from "lodash";
import { selector } from "recoil";
import activeRemoteMembershipsState from "./activeRemoteMembershipsState";
import groupIdState from "./groupIdState";
import membershipIdState from "./membershipIdState";

const lobbyMembershipIdsState = selector<string[]>({
  key: 'lobbyMembershipIdsState',
  get: ({ get }) => {
    const activeRemoteMemberships = get(activeRemoteMembershipsState)
    const lobbyRemoteMemberships = _.filter(activeRemoteMemberships, (remoteMembership) => !remoteMembership.groupId)
    const lobbyRemoteMembershipIds = _.map(lobbyRemoteMemberships, 'id')

    const groupId = get(groupIdState)
    const membershipId = get(membershipIdState)

    if (!groupId) {
      return [...lobbyRemoteMembershipIds, membershipId]
    }
    return lobbyRemoteMembershipIds
  }
})
export default lobbyMembershipIdsState
