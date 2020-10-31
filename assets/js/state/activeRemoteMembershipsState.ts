import _ from "lodash"
import { selector } from "recoil"
import remoteMembershipsState, { RemoteMembership } from "./remoteMembershipsState"

const activeRemoteMembershipsState = selector<RemoteMembership[]>({
  key: 'activeRemoteMembershipsState',
  get: ({ get }) => {
    return _.filter(get(remoteMembershipsState), 'active')
  }
})
export default activeRemoteMembershipsState
