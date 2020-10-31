import _ from "lodash";
import md5 from "md5";
import { selectorFamily } from "recoil";
import groupMembershipIdsState from "./groupMembershipIdsState";

const groupMembershipIdsSortedDeterministicallyState = selectorFamily<string[], string>({
  key: 'groupMembershipIdsSortedDeterministicallyState',
  get: (id) => {
    return ({ get }) => {
      const unsortedGroupMembershipIds = get(groupMembershipIdsState(id))
      return _.sortBy(unsortedGroupMembershipIds, (membershipId) => md5(`${id}-${membershipId}`))
    }
  }
})
export default groupMembershipIdsSortedDeterministicallyState
