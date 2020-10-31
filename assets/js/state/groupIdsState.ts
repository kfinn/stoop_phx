import _ from "lodash";
import { selector } from "recoil";
import activeRemoteMembershipsState from "./activeRemoteMembershipsState";
import groupIdState from "./groupIdState";

const groupIdsState = selector<string[]>({
  key: 'groupIdsState',
  get: ({ get }) => {
    const activeRemoteMemberships = get(activeRemoteMembershipsState)
    const activeRemoteMembershipGroupIds = _.map(activeRemoteMemberships, 'groupId')
    const groupId = get(groupIdState)

    return _.uniq(_.compact([groupId, ...activeRemoteMembershipGroupIds]))
  }
})
export default groupIdsState
