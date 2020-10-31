import _ from "lodash";
import { selectorFamily } from "recoil";
import groupMembershipIdsSortedDeterministicallyState from "./groupMembershipIdsSortedDeterministicallyState";

interface RowLayout {
  membershipIds: string[]
}

export interface GroupLayoutCandidate {
  groupId: string
  columnsCount: number
  rowLayouts: RowLayout[]
}

export function buildLayoutCandidates({ groupId, membershipIds }: { groupId: string, membershipIds: string[] }): GroupLayoutCandidate[] {
  const count = _.size(membershipIds)
  if (count == 0) {
    return [{ groupId, columnsCount: 0, rowLayouts: [] }]
  }

  const rowsCountCandidates = _.range(1, count + 1)

  return _.map(rowsCountCandidates, (rowsCount) => {
    const itemsPerRowCountWithoutRemainder = _.floor(count / rowsCount)
    const itemsPerRowCountWithRemainder = itemsPerRowCountWithoutRemainder + 1
    const rowsWithExtraItemCount = count % rowsCount

    let itemsAddedToRowCount = 0
    const rowLayouts = _.map(_.range(rowsCount), (rowIndex) => {
      const startIndex = itemsAddedToRowCount
      const rowItemsCount = rowIndex < rowsWithExtraItemCount ? itemsPerRowCountWithRemainder : itemsPerRowCountWithoutRemainder

      itemsAddedToRowCount = itemsAddedToRowCount + rowItemsCount

      return { membershipIds: _.slice(membershipIds, startIndex, startIndex + rowItemsCount) }
    })

    return {
      groupId,
      columnsCount: rowsWithExtraItemCount > 0 ? itemsPerRowCountWithRemainder : itemsPerRowCountWithoutRemainder,
      rowLayouts
    }
  })
}

const groupLayoutCandidatesState = selectorFamily<GroupLayoutCandidate[], string>({
  key: 'groupLayoutCandidatesState',
  get: (groupId) => {
    return ({ get }) => {
      if (groupId) {
        const membershipIds = get(groupMembershipIdsSortedDeterministicallyState(groupId))      
        return buildLayoutCandidates({ groupId, membershipIds })
      } else {
        return [{
          groupId,
          columnsCount: 0,
          rowLayouts: []
        }]
      }
    }
  }
})
export default groupLayoutCandidatesState
