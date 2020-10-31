import _ from "lodash"
import { selector } from "recoil"
import { GroupLayoutCandidate } from "./groupLayoutCandidatesState"
import layoutState, { currentGroupLayoutSize, MARGIN, otherGroupLayoutSize, otherGroupsRegionLayoutSize } from "./layoutState"

interface LobbyLayout extends GroupLayoutCandidate {
  top: number,
  left: number,
  width: number,
  height: number,
  scale: number
}

const lobbyLayoutState = selector<LobbyLayout>({
  key: 'lobbyLayoutState',
  get: ({ get }) => {
    const layout = get(layoutState)
    const { currentGroupLayout, otherGroupsRegionLayout, lobbyLayout, scale } = layout

    const currentGroupSize = currentGroupLayoutSize(currentGroupLayout)
    const otherGroupsRegionSize = otherGroupsRegionLayoutSize(otherGroupsRegionLayout)

    const previousRows = _.size(_.filter([currentGroupSize, otherGroupsRegionSize], ({ height }) => height > 0))

    const { width, height } = otherGroupLayoutSize(lobbyLayout)

    const excessWidth = layout.width - width
    const marginLeft = excessWidth / 2

    return {
      top: currentGroupSize.height + otherGroupsRegionSize.height + (previousRows * MARGIN) + layout.top,
      left: layout.left + marginLeft,
      width,
      height,
      scale,
      ...lobbyLayout
    }
  }
})
export default lobbyLayoutState
