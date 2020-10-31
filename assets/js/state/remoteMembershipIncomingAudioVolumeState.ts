import { selectorFamily } from "recoil";
import groupIdState from "./groupIdState";
import quietVolumeState from "./quietVolumeState";
import remoteMembershipMutedState from "./remoteMembershipMutedState";
import remoteMembershipState from "./remoteMembershipState";

const remoteMembershipIncomingAudioVolumeState = selectorFamily<number, string>({
  key: 'remoteMembershipIncomingAudioVolumeState',
  get: (id) => {
    return ({ get }) => {
      const remoteMembership = get(remoteMembershipState(id))
      const remoteMembershipMuted = get(remoteMembershipMutedState(id))
      const groupId = get(groupIdState)

      // I have manually muted the other end of this pair
      if (remoteMembershipMuted) {
        return 0
      }

      //  the other end of this pair is shouting to everyone
      if (remoteMembership.shouting) {
        return 1
      }

      // the other end of the pair is muted
      if (remoteMembership.muted) {
        return 0
      }

      // I am not in a group
      if (!groupId) {
        return 1
      }

      // I am in the same group as the other end of this pair
      if (groupId == remoteMembership.groupId) {
        return 1
      }

      return get(quietVolumeState)
    }
  }
})
export default remoteMembershipIncomingAudioVolumeState
