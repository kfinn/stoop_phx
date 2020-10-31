import _ from "lodash"
import { selector } from "recoil"
import activeRemoteMembershipsState from "./activeRemoteMembershipsState"

const activeRemoteMembershipsCountState = selector({
  key: 'activeRemoteMembershipsCountState',
  get: ({ get }) => {
    return _.size(get(activeRemoteMembershipsState))
  }
})
export default activeRemoteMembershipsCountState
