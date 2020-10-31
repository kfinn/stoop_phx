import { VolumesByMembershipId } from "hooks/useConnectionVolumes";
import { atom } from "recoil";

const membershipRecentMaxVolumesState = atom<VolumesByMembershipId>({
  key: 'membershipRecentMaxVolumesState',
  default: {}
})
export default membershipRecentMaxVolumesState
