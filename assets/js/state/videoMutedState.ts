import { atom } from "recoil"

const videoMutedState = atom({
    key: 'videoMutedState',
    default: false
})
export default videoMutedState
