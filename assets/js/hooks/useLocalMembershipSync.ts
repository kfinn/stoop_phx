import _ from "lodash"
import { useEffect, useMemo, useState } from "react"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import groupIdState from "state/groupIdState"
import invitationMembershipIdState from "state/invitationMembershipIdState"
import mutedState from "state/mutedState"
import nameState from "state/nameState"
import shoutingState from "state/shoutingState"
import twilioParticipantSidState from "state/twilioParticipantSidState"
import videoMutedState from "state/videoMutedState"
import useSubscription from "./useSubscription"

enum LocalMembershipChannelEvent {
  CONNECTED = 'connected',
  UPDATED = 'updated',
}

function toLocalMembershipParams(localMembership: any) {
  return _.pick(
    localMembership,
    'name',
    'muted',
    'videoMuted',
    'shouting',
    'twilioParticipantSid',
    'invitationMembershipId'
  )
}

export default function useLocalMembershipSync(membershipId: string) {
  const [name, setName] = useRecoilState(nameState)
  const [muted, setMuted] = useRecoilState(mutedState)
  const [videoMuted, setVideoMuted] = useRecoilState(videoMutedState)
  const [shouting, setShouting] = useRecoilState(shoutingState)
  const [invitationMembershipId, setInvitationMembershipId] = useRecoilState(invitationMembershipIdState)
  const twilioParticipantSid = useRecoilValue(twilioParticipantSidState)
  const setGroupId = useSetRecoilState(groupIdState)

  const localMembershipParams = useMemo(() => ({
    name,
    muted,
    videoMuted,
    shouting,
    twilioParticipantSid,
    invitationMembershipId
  }), [
    name,
    muted,
    videoMuted,
    shouting,
    twilioParticipantSid,
    invitationMembershipId
  ])

  const setLocalMembership = ({
    name,
    muted,
    videoMuted,
    shouting,
    groupId,
    invitationMembershipId
  }) => {
    setName(name)
    setMuted(muted)
    setVideoMuted(videoMuted)
    setShouting(shouting)
    setGroupId(groupId)
    setInvitationMembershipId(invitationMembershipId)
  }

  const [syncedLocalMembershipParams, setSyncedLocalMembershipParams] = useState({})

  const subscription = useSubscription(
    'local_member',
    {
      [LocalMembershipChannelEvent.CONNECTED]: ({ name: serverName, ...otherLocalMembershipAttributes }) => {
        const connectedLocalMembership = {
          ...localMembershipParams,
          ...otherLocalMembershipAttributes,
          name: name || serverName
        }
        setSyncedLocalMembershipParams(toLocalMembershipParams(connectedLocalMembership))
        setLocalMembership(connectedLocalMembership)
      },
      [LocalMembershipChannelEvent.UPDATED]: (updatedLocalMembership) => {
        const mergedLocalMembership = { ...localMembershipParams, ...updatedLocalMembership }

        setSyncedLocalMembershipParams(toLocalMembershipParams(mergedLocalMembership))
        setLocalMembership(mergedLocalMembership)
      }
    }
  )

  useEffect(() => {
    if (!_.isEqual(localMembershipParams, syncedLocalMembershipParams)) {
      subscription.perform('update', { localMember: localMembershipParams })
      setSyncedLocalMembershipParams(localMembershipParams)
    }
  }, [localMembershipParams])
}
