import { atom } from "recoil";

const nameState = atom<string>({
    key: 'nameState',
    default: null
})
export default nameState
