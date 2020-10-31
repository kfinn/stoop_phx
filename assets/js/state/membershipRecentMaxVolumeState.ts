import _ from "lodash";
import { number } from "prop-types";
import { selectorFamily } from "recoil";
import membershipRecentMaxVolumesState from "./membershipRecentMaxVolumesState";

const membershipRecentMaxVolumeState = selectorFamily<number, string>({
  key: 'membershipRecentMaxVolumeState',
  get: (id) => {
    return ({ get }) => {
      return _.get(get(membershipRecentMaxVolumesState), id, 0)
    }
  }
})
export default membershipRecentMaxVolumeState
