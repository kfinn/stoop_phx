import { selectorFamily } from "recoil";
import groupIdState from "./groupIdState";
import remoteMembershipState from "./remoteMembershipState";

export enum AudioFilter {
    ENABLED = 'enabled',
    QUIET = 'quiet',
    DISABLED = 'disabled'
}

const remoteMembershipOutgoingAudioFilterState = selectorFamily<AudioFilter, string>({
    key: 'remoteMembershipOutgoingAudioFilterState',
    get: (id) => {
        return ({ get }) => {
            const remoteMembership = get(remoteMembershipState(id))
            const groupId = get(groupIdState)

            // the other end of this pair is not in a group
            if (!remoteMembership.groupId) {
                return AudioFilter.ENABLED
            }

            // the other end of this pair is in the same group as me
            if (remoteMembership.groupId == groupId) {
                return AudioFilter.ENABLED
            }

            return AudioFilter.QUIET
        }
    }
})
export default remoteMembershipOutgoingAudioFilterState
