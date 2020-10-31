import { selector } from "recoil"
import mutedState from "./mutedState"

const localAudioTrackEnabledState = selector({
  key: 'localAudioTrackEnabledState',
  get: ({ get }) => {
    const muted = get(mutedState)

    return !muted
  }
})
export default localAudioTrackEnabledState
