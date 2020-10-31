import { VIDEO_CELL_UNIT_SIZE } from "components/VideoCell";
import { selectorFamily } from "recoil";
import membershipLayoutState from "./membershipLayoutState";

const membershipTransformState = selectorFamily<string, string>({
  key: 'membershipTransformState',
  get: (id) => {
    return ({ get }) => {
      const membershipLayout = get(membershipLayoutState(id))

      const screenScale = membershipLayout.scale / VIDEO_CELL_UNIT_SIZE

      const dx = membershipLayout.left * VIDEO_CELL_UNIT_SIZE
      const dy = membershipLayout.top * VIDEO_CELL_UNIT_SIZE

      return `scale(${screenScale}) translate(${dx}px, ${dy}px)`
    }
  }
})
export default membershipTransformState
