import { atom } from "recoil"

const groupIdState = atom<string>({
    key: 'groupIdState',
    default: null
})
export default groupIdState
