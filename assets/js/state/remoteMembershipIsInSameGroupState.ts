import { selectorFamily } from "recoil";
import groupIdState from "./groupIdState";
import remoteMembershipState from "./remoteMembershipState";

const remoteMembershipIsInSameGroupState = selectorFamily<boolean, string>({
  key: 'remoteMembershipIsInSameGroupState',
  get: (id) => {
    return ({ get }) => {
      const groupId = get(groupIdState)
      const remoteMembership = get(remoteMembershipState(id))
      return groupId && groupId === remoteMembership.groupId
    }
  }
})
export default remoteMembershipIsInSameGroupState
