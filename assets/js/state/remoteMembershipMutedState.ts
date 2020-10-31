import { atomFamily } from "recoil";

const remoteMembershipMutedState = atomFamily<boolean, string>({
  key: 'remoteMembershipMutedState',
  default: false
})
export default remoteMembershipMutedState
