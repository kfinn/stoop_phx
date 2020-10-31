import classNames from "classnames";
import useRemoteConnection from "hooks/useRemoteConnection";
import React from "react";
import { Button } from "react-bootstrap";
import { useRecoilState, useRecoilValue } from "recoil";
import groupIdState from "state/groupIdState";
import remoteMembershipIsInvitationMembershipState from "state/remoteMembershipIsInvitationMembershipState";
import remoteMembershipIsSendingInvitationState from "state/remoteMembershipIsSendingInvitationState";
import remoteMembershipMutedState from "state/remoteMembershipMutedState";
import remoteMembershipState from "state/remoteMembershipState";

export default function RemoteMembershipVideoActions({ id }: { id: string }) {
  const remoteMembership = useRecoilValue(remoteMembershipState(id))
  const groupId = useRecoilValue(groupIdState)
  const [remoteMembershipMuted, setRemoteMembershipMuted] = useRecoilState(remoteMembershipMutedState(id))
  const { subscription } = useRemoteConnection(id)

  const remoteMembershipIsSendingInvitation = useRecoilValue(remoteMembershipIsSendingInvitationState(id))
  const [remoteMembershipIsInvitationMembership, setRemoteMembershipIsInvitationMembership] = useRecoilState(remoteMembershipIsInvitationMembershipState(id))

  const createGroup = () => {
    subscription.perform('create_group', {})
  }

  const joinGroup = () => {
    subscription.perform('join_group', {})
  }

  return <div className={classNames('video-actions', { show: remoteMembership.videoMuted })}>
    <div className="text-light">{remoteMembership.name}</div>
    {
      remoteMembershipIsSendingInvitation ? (
        <Button variant="success" onClick={createGroup}>Create Group</Button>
      ) : (
        remoteMembershipIsInvitationMembership ?(
          <Button variant="danger" onClick={() => setRemoteMembershipIsInvitationMembership(false)}>Cancel Invitation</Button>
        ) : (
          <Button variant="success" onClick={() => setRemoteMembershipIsInvitationMembership(true)}>Invite to New Group</Button>
        )
      )
    }
    {
      remoteMembership.groupId && remoteMembership.groupId !== groupId && (
        <Button variant="success" onClick={joinGroup}>Join Group</Button>
      )
    }
    {
      remoteMembershipMuted ? (
        <Button variant="danger" onClick={() => setRemoteMembershipMuted(false)}>Unmute</Button>
      ) : (
          <Button variant="danger" onClick={() => setRemoteMembershipMuted(true)}>Mute</Button>
        )
    }
  </div>
}
