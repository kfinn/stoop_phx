import { faBullhorn, faMicrophoneSlash, faVolumeMute } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import useRemoteConnection from "hooks/useRemoteConnection";
import React, { useEffect, useMemo } from "react";
import { useRecoilValue } from "recoil";
import groupIdState from "state/groupIdState";
import membershipIdState from "state/membershipIdState";
import remoteMembershipIsInvitationMembershipState from "state/remoteMembershipIsInvitationMembershipState";
import remoteMembershipIsSendingInvitationState from "state/remoteMembershipIsSendingInvitationState";
import remoteMembershipMutedState from "state/remoteMembershipMutedState";
import remoteMembershipOutgoingAudioFilterState from "state/remoteMembershipOutgoingAudioFilterState";
import remoteMembershipState from "state/remoteMembershipState";
import remoteMembershipVideoTrackPriorityState from "state/remoteMembershipVideoTrackPriorityState";
import AttachedVideoTrack from "./AttachedVideoTrack";
import RemoteMembershipAudioTrack from "./RemoteMembershipAudioTrack";
import RemoteMembershipVideoActions from "./RemoteMembershipVideoActions";

export default function RemoteMembershipVideo({ id }: { id: string }) {
  const remoteMembership = useRecoilValue(remoteMembershipState(id))
  const { videoTrack } = useRemoteConnection(id)

  const membershipId = useRecoilValue(membershipIdState)
  const groupId = useRecoilValue(groupIdState)

  const remoteAudioIcon = useMemo(() => {
    if (
      remoteMembership.muted ||
      (
        groupId &&
        groupId !== remoteMembership.groupId
      )
    ) {
      return faMicrophoneSlash
    } else {
      return null
    }
  }, [
    remoteMembership.muted,
    remoteMembership.groupId,
    membershipId,
    groupId
  ])

  const audioFilter = useRecoilValue(remoteMembershipOutgoingAudioFilterState(id))

  const remoteMembershipMuted = useRecoilValue(remoteMembershipMutedState(id))
  const remoteMembershipIsSendingInvitation = useRecoilValue(remoteMembershipIsSendingInvitationState(id))
  const remoteMembershipIsInvitationMembership = useRecoilValue(remoteMembershipIsInvitationMembershipState(id))
  const activeInvitation = remoteMembershipIsSendingInvitation || remoteMembershipIsInvitationMembership

  const remoteMembershipVideoTrackPriority = useRecoilValue(remoteMembershipVideoTrackPriorityState(id))

  useEffect(() => {
    if (!videoTrack) {
      return;
    }
    if (videoTrack.priority != remoteMembershipVideoTrackPriority) {
      (videoTrack as unknown as { setPriority: (priority: string) => void}).setPriority(remoteMembershipVideoTrackPriority)
    }
  }, [remoteMembershipVideoTrackPriority, videoTrack])

  return <div className={classNames('video-container', { shouting: remoteMembership.shouting, 'active-invitation': activeInvitation })}>
    {
      videoTrack && <AttachedVideoTrack videoTrack={videoTrack} className={classNames('video', audioFilter)} autoPlay />
    }
    <RemoteMembershipAudioTrack id={id} />
    <RemoteMembershipVideoActions id={id} />
    <div className="video-status">
      {
        remoteAudioIcon && (
          <FontAwesomeIcon icon={remoteAudioIcon} />
        )
      }
      {
        remoteMembershipMuted && (
          <FontAwesomeIcon icon={faVolumeMute} />
        )
      }
      {
        remoteMembership.shouting && (
          <FontAwesomeIcon icon={faBullhorn} />
        )
      }
    </div>
  </div>
}
