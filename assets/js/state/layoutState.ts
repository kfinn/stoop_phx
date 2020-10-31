import { VIDEO_ASPECT_RATIO } from "components/VideoCell";
import _ from "lodash";
import { selector } from "recoil";
import { GroupLayoutCandidate } from "./groupLayoutCandidatesState";
import layoutCandidatesState, { LayoutCandidate, OtherGroupsRegionLayout, OtherGroupsRegionRowLayout } from "./layoutCandidatesState";
import participantGridSizeState from "./participantGridSizeState";

export interface Layout extends LayoutCandidate {
  top: number
  left: number
  width: number
  height: number
  scale: number
}

export const MARGIN = 0.05

function layoutSize({ currentGroupLayout, otherGroupsRegionLayout, lobbyLayout }: LayoutCandidate) {
  const currentGroupSize = currentGroupLayoutSize(currentGroupLayout)
  const otherGroupsSize = otherGroupsRegionLayoutSize(otherGroupsRegionLayout)
  const lobbySize = otherGroupLayoutSize(lobbyLayout)

  const layoutRowSizes = [currentGroupSize, otherGroupsSize, lobbySize]

  const presentLayoutRowsCount = _.size(_.filter(layoutRowSizes, ({ height }) => height > 0))

  return {
    width: _.max(_.map(layoutRowSizes, 'width')) || 0,
    height: (_.sumBy(layoutRowSizes, 'height') || 0) + (presentLayoutRowsCount * MARGIN)
  }
}

export function otherGroupsRegionLayoutRowSize({ groupLayouts }: OtherGroupsRegionRowLayout) {
  const sizes = _.map(groupLayouts, otherGroupLayoutSize)
  const groupsCount = _.size(groupLayouts)
  const totalMargin = groupsCount > 0 ? (groupsCount - 1) * MARGIN : 0

  return {
    width: (_.sumBy(sizes, 'width') || 0) + totalMargin,
    height: _.max(_.map(sizes, 'height')) || 0
  }
}

export function otherGroupsRegionLayoutSize({ rowLayouts }: OtherGroupsRegionLayout) {
  const rowSizes = _.map(rowLayouts, otherGroupsRegionLayoutRowSize)
  const rowsCount = _.size(rowLayouts)
  const totalMargin = rowsCount > 0 ? (rowsCount - 1) * MARGIN : 0

  return {
    width: _.max(_.map(rowSizes, 'width')) || 0,
    height: (_.sumBy(rowSizes, 'height') || 0) + totalMargin
  }
}

export function currentGroupLayoutSize(currentGroupLayoutCandidate: GroupLayoutCandidate) {
  return groupLayoutSize(currentGroupLayoutCandidate, 2)
}

export function otherGroupLayoutSize(otherGroupLayoutCandidate: GroupLayoutCandidate) {
  return groupLayoutSize(otherGroupLayoutCandidate, 1)
}

function groupLayoutSize(groupLayoutCandidate: GroupLayoutCandidate, scale: number) {
  const { rowLayouts, columnsCount } = groupLayoutCandidate

  return {
    height: _.size(rowLayouts) * scale,
    width: columnsCount * VIDEO_ASPECT_RATIO * scale
  }
}

const layoutState = selector({
  key: 'layoutState',
  get: ({ get }) => {
    const layoutCandidates = get(layoutCandidatesState)
    const participantGridSize = get(participantGridSizeState)

    const optimalLayoutCandidate =  _.maxBy(
      layoutCandidates,
      (layout) => {
        const size = layoutSize(layout)

        const verticalFitScale = participantGridSize.height / size.height
        const horizontalFitScale = participantGridSize.width / size.width

        return _.min([verticalFitScale, horizontalFitScale])
      }
    )

    const optimalLayoutSize = layoutSize(optimalLayoutCandidate)
    
    const verticalFitScale = participantGridSize.height / optimalLayoutSize.height
    const horizontalFitScale = participantGridSize.width / optimalLayoutSize.width

    const layoutScaledWidth = participantGridSize.width / verticalFitScale
    const excessWidth = _.max([layoutScaledWidth - optimalLayoutSize.width, 0])
    const left = excessWidth / 2

    return {
      ...optimalLayoutCandidate,
      top: 0,
      left,
      ...optimalLayoutSize,
      scale: _.min([verticalFitScale, horizontalFitScale])
    }
  }
})
export default layoutState
