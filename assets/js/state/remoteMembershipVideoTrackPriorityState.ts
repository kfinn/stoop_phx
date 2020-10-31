import { selectorFamily } from "recoil";
import Video from "twilio-video";
import groupIdState from "./groupIdState";
import remoteMembershipState from "./remoteMembershipState";

const remoteMembershipVideoTrackPriorityState = selectorFamily<Video.Track.Priority, string>({
  key: 'twilioRemoteParticipantVideoTrackPriorityState',
  get: (id) => {
    return ({ get }) => {
      const remoteMembership = get(remoteMembershipState(id))
      const groupId = get(groupIdState)

      if (groupId) {
        if (remoteMembership.groupId === groupId) {
          return 'standard'
        } else {
          return 'low'
        }
      } else {
        return 'standard'
      }
    }
  }
})
export default remoteMembershipVideoTrackPriorityState
