import { atom } from "recoil"

const audioInputDeviceIdState = atom<string>({
    key: 'audioInputDeviceIdState',
    default: null
})
export default audioInputDeviceIdState
