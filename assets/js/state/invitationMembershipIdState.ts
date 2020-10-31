import { atom } from "recoil"

const invitationMembershipIdState = atom<string>({
  key: 'invitationMembershipIdState',
  default: null
})
export default invitationMembershipIdState
