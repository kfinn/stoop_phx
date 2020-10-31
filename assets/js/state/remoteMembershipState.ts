import _ from "lodash"
import { selectorFamily } from "recoil"
import remoteMembershipsState, { RemoteMembership } from "./remoteMembershipsState"

const remoteMembershipState = selectorFamily<RemoteMembership, string>({
  key: 'remoteMembershipState',
  get: (id) => {
    return ({ get }) => {
      const remoteMemberships = get(remoteMembershipsState)
      return _.find(remoteMemberships, (remoteMembership) => remoteMembership.id === id)
    }
  }
})
export default remoteMembershipState
