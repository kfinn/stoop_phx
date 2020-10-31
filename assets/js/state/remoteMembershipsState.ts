import { atom } from "recoil"

export interface RemoteMembership {
  id: string
  twilioParticipantSid: string
  muted: boolean
  videoMuted: boolean
  shouting: boolean
  name: string
  groupId: string
  active: boolean
  invitationMembershipId: string
}

const remoteMembershipsState = atom<RemoteMembership[]>({
  key: 'remoteMembershipsState',
  default: []
})
export default remoteMembershipsState
