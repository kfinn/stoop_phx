import { selectorFamily } from "recoil";
import membershipIdState from "./membershipIdState";
import remoteMembershipState from "./remoteMembershipState";

const remoteMembershipIsSendingInvitationState = selectorFamily<boolean, string>({
  key: 'remoteMembershipIsSendingInvitationState',
  get: (id) => {
    return ({ get }) => {
      const { invitationMembershipId } = get(remoteMembershipState(id))
      const membershipId = get(membershipIdState)
      return membershipId === invitationMembershipId
    }
  }
})
export default remoteMembershipIsSendingInvitationState
