import { atom } from "recoil"

const membershipIdState = atom<string>({
  key: 'membershipIdState',
  default: null
})
export default membershipIdState
