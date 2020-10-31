import { selectorFamily } from "recoil";
import invitationMembershipIdState from "./invitationMembershipIdState";

const remoteMembershipIsInvitationMembershipState = selectorFamily<boolean, string>({
  key: 'remoteMembershipIsInvitationMembershipState',
  get: (id) => {
    return ({ get }) => {
      const invitationMembershipId = get(invitationMembershipIdState)
      return invitationMembershipId === id
    }
  },
  set: (id) => {
    return ({ get, set, reset }, newValue) => {
      if (newValue) {
        set(invitationMembershipIdState, id)
      } else {
        const invitationMembershipId = get(invitationMembershipIdState)
        if (invitationMembershipId === id) {
          reset(invitationMembershipIdState)
        }
      }
    }
  }
})
export default remoteMembershipIsInvitationMembershipState
