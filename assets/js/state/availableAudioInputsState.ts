import availableMediaDevicesState from "./availableMediaDevicesState"
import { selector } from "recoil"
import _ from "lodash"

const availableAudioInputsState = selector<MediaDeviceInfo[]>({
    key: 'availableAudioInputsState',
    get: ({ get }) => {
        const availableMediaDevices = get(availableMediaDevicesState)
        return _.filter(availableMediaDevices, ({ kind }) => kind === 'audioinput')
    }
})
export default availableAudioInputsState
