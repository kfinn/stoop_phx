import availableMediaDevicesState from "./availableMediaDevicesState"
import { selector } from "recoil"
import _ from "lodash"

const availableVideoInputsState = selector<MediaDeviceInfo[]>({
    key: 'availableVideoInputsState',
    get: ({ get }) => {
        const availableMediaDevices = get(availableMediaDevicesState)
        return _.filter(availableMediaDevices, ({ kind }) => kind === 'videoinput')
    }
})
export default availableVideoInputsState
