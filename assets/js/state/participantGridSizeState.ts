import { atom } from "recoil";

interface Size {
    width: number
    height: number
}

const participantGridSizeState = atom<Size>({
    key: 'participantGridSizeState',
    default: {
        width: window.innerWidth,
        height: window.innerHeight
    }
})
export default participantGridSizeState
