import { atom } from "recoil"

const videoInputDeviceIdState = atom<string>({
    key: 'videoInputDeviceIdState',
    default: null
})
export default videoInputDeviceIdState
