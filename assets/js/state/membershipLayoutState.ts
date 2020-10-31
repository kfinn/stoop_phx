import { VIDEO_ASPECT_RATIO } from "components/VideoCell"
import _ from "lodash"
import { selectorFamily } from "recoil"
import groupIdState from "./groupIdState"
import groupLayoutState from "./groupLayoutState"
import { currentGroupLayoutSize, otherGroupLayoutSize } from "./layoutState"
import lobbyLayoutState from "./lobbyLayoutState"
import membershipIdState from "./membershipIdState"
import remoteMembershipState from "./remoteMembershipState"

interface MembershipLayout {
  top: number
  left: number
  scale: number
}

const membershipLayoutState = selectorFamily<MembershipLayout, string>({
  key: 'membershipLayoutState',
  get: (id) => {
    return ({ get }) => {
      const currentMembershipId = get(membershipIdState)
      const currentGroupId = get(groupIdState)

      const groupId = id === currentMembershipId ? currentGroupId : get(remoteMembershipState(id)).groupId
      const groupLayout = groupId ? get(groupLayoutState(groupId)) : get(lobbyLayoutState)

      const inCurrentGroup = groupId && groupId == currentGroupId
      const contentSize = inCurrentGroup ? currentGroupLayoutSize(groupLayout) : otherGroupLayoutSize(groupLayout)
      const currentGroupScaleAdjustment = inCurrentGroup ? 2 : 1

      const rowIndex = _.findIndex(
        groupLayout.rowLayouts,
        (rowLayout) => (
          _.includes(rowLayout.membershipIds, id)
        )
      )

      const rowLayout = groupLayout.rowLayouts[rowIndex]
      const membershipIndex = _.indexOf(rowLayout.membershipIds, id)

      const rowCenteringMarginLeft = _.size(rowLayout.membershipIds) == groupLayout.columnsCount ? 0 : (0.5 * VIDEO_ASPECT_RATIO)

      const groupCenteringMarginTop = ((groupLayout.height - contentSize.height) / 2)
      const groupCenteringMarginLeft = ((groupLayout.width - contentSize.width) / 2) * VIDEO_ASPECT_RATIO

      return {
        top: (groupLayout.top / currentGroupScaleAdjustment) + rowIndex + groupCenteringMarginTop,
        left: (groupLayout.left / currentGroupScaleAdjustment) + (membershipIndex * VIDEO_ASPECT_RATIO) + rowCenteringMarginLeft + groupCenteringMarginLeft,
        scale: groupLayout.scale * currentGroupScaleAdjustment
      }
    }
  }
})
export default membershipLayoutState
