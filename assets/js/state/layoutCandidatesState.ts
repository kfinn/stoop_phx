import _ from "lodash";
import { selector } from "recoil";
import groupIdsState from "./groupIdsState";
import groupIdState from "./groupIdState";
import groupLayoutCandidatesState, { GroupLayoutCandidate } from "./groupLayoutCandidatesState";
import lobbyLayoutCandidatesState from "./lobbyLayoutCandidatesState";

export interface LayoutCandidate {
  currentGroupLayout: GroupLayoutCandidate
  otherGroupsRegionLayout: OtherGroupsRegionLayout
  lobbyLayout: GroupLayoutCandidate
}

export interface OtherGroupsRegionRowLayout {
  groupLayouts: GroupLayoutCandidate[]
}

export interface OtherGroupsRegionLayout {
  rowLayouts: OtherGroupsRegionRowLayout[]
  columnsCount: number
}

interface GroupLayoutCandidatesByGroupId {
  [groupId: string]: GroupLayoutCandidate[]
}

function buildMediumEmphasisRegionLayoutCandidates(groupIds: string[], groupLayoutCandidatesByGroupId: GroupLayoutCandidatesByGroupId): OtherGroupsRegionLayout[] {
  if (_.isEmpty(groupIds)) {
    return [{
      columnsCount: 0,
      rowLayouts: []
    }]
  }

  const firstRowSizeCandidates = _.rangeRight(1, _.size(groupIds) + 1)

  return _.flatMap(
    firstRowSizeCandidates,
    (firstRowSizeCandidate) => {
      const firstRowGroupIds = _.slice(groupIds, 0, firstRowSizeCandidate)
      const remainingGroupIds = _.slice(groupIds, firstRowSizeCandidate)

      const laterRowsCandidates = buildMediumEmphasisRegionLayoutCandidates(remainingGroupIds, groupLayoutCandidatesByGroupId)

      const firstRowLayoutCandidates: GroupLayoutCandidate[][] = _.reduce(
        firstRowGroupIds,
        (firstRowLayoutCandidatesAcc, groupId) => {
          const groupLayoutCandidates = groupLayoutCandidatesByGroupId[groupId]

          return _.flatMap(groupLayoutCandidates, (groupLayoutCandidate) => (
            _.map(firstRowLayoutCandidatesAcc, (firstRowLayoutCandidateAcc) => [
              ...firstRowLayoutCandidateAcc,
              groupLayoutCandidate
            ])
          ))
        },
        [[]] as GroupLayoutCandidate[][]
      )

      return _.flatMap(
        firstRowLayoutCandidates,
        (firstRowLayoutCandidate) => (
          _.map(
            laterRowsCandidates,
            (laterRowsCandidate) => ({
              columnsCount: _.max([laterRowsCandidate.columnsCount, firstRowSizeCandidate]),
              rowLayouts: [
                { groupLayouts: firstRowLayoutCandidate },
                ...laterRowsCandidate.rowLayouts
              ]
            })
          )
        )
      )
    }
  )
}

const layoutCandidatesState = selector<LayoutCandidate[]>({
  key: 'layoutCandidatesState',
  get: ({ get }) => {
    const groupId = get(groupIdState)
    const groupIds = get(groupIdsState)

    const groupLayoutCandidates = get(groupLayoutCandidatesState(groupId))
    const lobbyLayoutCandidates = get(lobbyLayoutCandidatesState)

    const otherGroupIds = _.without(groupIds, groupId)

    const otherGroupLayoutCandidatesByGroupId = {}
    _.each(otherGroupIds, (groupId) => otherGroupLayoutCandidatesByGroupId[groupId] = get(groupLayoutCandidatesState(groupId)))

    const otherGroupsRegionLayoutCandidates = buildMediumEmphasisRegionLayoutCandidates(otherGroupIds, otherGroupLayoutCandidatesByGroupId)

    return _.flatMap(groupLayoutCandidates, (currentGroupLayout) => (
      _.flatMap(otherGroupsRegionLayoutCandidates, (otherGroupsRegionLayout) => (
        _.map(lobbyLayoutCandidates, (lobbyLayout) => ({
          currentGroupLayout,
          otherGroupsRegionLayout,
          lobbyLayout
        }))
      ))
    ))
  }
})
export default layoutCandidatesState
