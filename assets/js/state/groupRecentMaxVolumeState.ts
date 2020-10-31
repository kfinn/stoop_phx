import _ from "lodash";
import { selectorFamily } from "recoil";
import groupMembershipIdsState from "./groupMembershipIdsState";
import membershipRecentMaxVolumeState from "./membershipRecentMaxVolumeState";

const groupRecentMaxVolumeState = selectorFamily<number, string>({
  key: 'groupRecentMaxVolumeState',
  get: (id) => {
    return ({ get }) => {
      const membershipIds = get(groupMembershipIdsState(id))
      const membershipRecentMaxVolumes = _.map(membershipIds, (membershipId) => get(membershipRecentMaxVolumeState(membershipId)))
      return _.max(membershipRecentMaxVolumes)
    }
  }
})
export default groupRecentMaxVolumeState
