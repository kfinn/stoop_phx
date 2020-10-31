import _ from "lodash";
import { selectorFamily } from "recoil";
import { GroupLayoutCandidate } from "./groupLayoutCandidatesState";
import layoutState, { currentGroupLayoutSize, MARGIN, otherGroupLayoutSize, otherGroupsRegionLayoutRowSize } from "./layoutState";

interface GroupLayout extends GroupLayoutCandidate {
  top: number
  left: number
  width: number
  height: number
  scale: number
}

const groupLayoutState = selectorFamily<GroupLayout, string>({
  key: 'groupLayoutState',
  get: (id) => {
    return ({ get }) => {
      const layout = get(layoutState)
      const computedCurrentGroupLayoutSize = currentGroupLayoutSize(layout.currentGroupLayout)

      if (layout.currentGroupLayout.groupId === id) {
        const { top, scale } = layout
        const { width, height } = computedCurrentGroupLayoutSize

        const excessWidth = layout.width - computedCurrentGroupLayoutSize.width

        return {
          top,
          left: layout.left + (excessWidth / 2),
          width,
          height,
          scale,
          ...layout.currentGroupLayout
        }
      } else {
        const layoutRowIndex = _.findIndex(
          layout.otherGroupsRegionLayout.rowLayouts,
          (rowLayout) => (
            _.some(rowLayout.groupLayouts, (groupLayout) => groupLayout.groupId === id)
          )
        )

        const previousRows = _.slice(layout.otherGroupsRegionLayout.rowLayouts, 0, layoutRowIndex)
        const previousRowsHeight = _.sumBy(previousRows, (previousRow) => otherGroupsRegionLayoutRowSize(previousRow).height)

        const row = layout.otherGroupsRegionLayout.rowLayouts[layoutRowIndex]
        const rowSize = otherGroupsRegionLayoutRowSize(row)

        const groupLayoutIndex = _.findIndex(
          row.groupLayouts,
          (groupLayout) => groupLayout.groupId === id
        )

        const previousGroupLayouts = _.slice(row.groupLayouts, 0, groupLayoutIndex)
        const previousGroupLayoutsWidth = _.sumBy(previousGroupLayouts, (previousGroupLayout) => otherGroupLayoutSize(previousGroupLayout).width)

        const group = row.groupLayouts[groupLayoutIndex]
        const groupSize = otherGroupLayoutSize(group)

        const marginTop = (layoutRowIndex + (computedCurrentGroupLayoutSize.height > 0 ? 1 : 0)) * MARGIN
        const marginLeft = (groupLayoutIndex) * MARGIN

        const excessLayoutWidth = layout.width - rowSize.width
        const rowMarginLeft = excessLayoutWidth / 2

        return {
          top: computedCurrentGroupLayoutSize.height + previousRowsHeight + marginTop + layout.top,
          left: previousGroupLayoutsWidth + marginLeft + layout.left + rowMarginLeft,
          width: groupSize.width,
          height: rowSize.height,
          scale: layout.scale,
          ...row.groupLayouts[groupLayoutIndex]
        }
      }
    }
  }
})
export default groupLayoutState
