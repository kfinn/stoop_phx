import _ from "lodash";
import { selectorFamily } from "recoil";
import activeRemoteMembershipsState from "./activeRemoteMembershipsState";
import groupIdState from "./groupIdState";
import membershipIdState from "./membershipIdState";

const groupMembershipIdsState = selectorFamily<string[], string>({
  key: 'groupMembershipIdsState',
  get: (id) => {
    return ({ get }) => {
      const activeRemoteMemberships = get(activeRemoteMembershipsState)
      const groupRemoteMemberships = _.filter(activeRemoteMemberships, (remoteMembership) => remoteMembership.groupId === id)
      const groupRemoteMembershipIds = _.map(groupRemoteMemberships, 'id')

      const groupId = get(groupIdState)
      const membershipId = get(membershipIdState)

      if (groupId === id) {
        return [...groupRemoteMembershipIds, membershipId]
      }
      return groupRemoteMembershipIds
    }
  }
})
export default groupMembershipIdsState
