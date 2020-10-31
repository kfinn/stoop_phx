import { MIN_VOLUME } from "components/VolumeVisualizer";
import { VOLUME_RANGE } from "hooks/useConnectionRecentMaxVolumes";
import _ from "lodash";
import { selector } from "recoil";
import backgroundAudioEnabledState from "./backgroundAudioEnabledState";
import groupIdState from "./groupIdState";
import groupRecentMaxVolumeState from "./groupRecentMaxVolumeState";

const MAX_QUIET_VOLUME = 0.1
const QUIET_VOLUME_MUTE_THRESHOLD = MIN_VOLUME + (VOLUME_RANGE / 4)

const quietVolumeState = selector<number>({
  key: 'quietVolumeState',
  get: ({ get }) => {
    const backgroundAudioEnabled = get(backgroundAudioEnabledState)
    if (!backgroundAudioEnabled) {
      return 0
    }

    const groupId = get(groupIdState)
    if (!groupId) {
      return MAX_QUIET_VOLUME
    }

    const currentGroupRecentMaxVolume = get(groupRecentMaxVolumeState(groupId))

    const normalizedCurrentGroupRecentMaxVolume = (currentGroupRecentMaxVolume - MIN_VOLUME) / (QUIET_VOLUME_MUTE_THRESHOLD - MIN_VOLUME)
    const interpolatedQuietVolume = (1 - normalizedCurrentGroupRecentMaxVolume) * MAX_QUIET_VOLUME

    return _.clamp(interpolatedQuietVolume, 0, MAX_QUIET_VOLUME)
  }
})
export default quietVolumeState
