import { RemoteConnection } from "contexts/RemoteConnectionsContext";
import TwilioRoomConnection from "models/TwilioRoomConnection";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import localAudioTrackEnabledState from "state/localAudioTrackEnabledState";
import membershipIdState from "state/membershipIdState";
import { RemoteMembership } from "state/remoteMembershipsState";
import videoMutedState from "state/videoMutedState";
import Video from "twilio-video";
import useLocalAudioTrack from "./useLocalAudioTrack";
import useLocalVideoTrack from "./useLocalVideoTrack";

export default function useTwilioRoom({ twilioRoomSid, token }: { twilioRoomSid: string, token: string }) {
  const membershipId = useRecoilValue(membershipIdState)

  const localAudioTrackEnabled = useRecoilValue(localAudioTrackEnabledState)
  const videoMuted = useRecoilValue(videoMutedState)

  const localVideoTrack = useLocalVideoTrack()
  const localAudioTrack = useLocalAudioTrack()

  const [twilioRoomConnection, setTwilioRoomConnection] = useState<TwilioRoomConnection>(null)
  
  const [
    remoteMemberships,
    setRemoteMemberships
  ] = useState<RemoteMembership[]>([])
  const [
    remoteConnections,
    setRemoteConnections
  ] = useState<RemoteConnection[]>([])
  
  const [
    localParticipantTwilioParticipantSid,
    setLocalParticipantTwilioParticipantSid
  ] = useState<string>(null)
  const [
    localParticipantVideoTrack,
    setLocalParticipantVideoTrack
  ] = useState<Video.LocalVideoTrack>(null)
  const [
    localParticipantAudioTrack,
    setLocalParticipantAudioTrack
  ] = useState<Video.LocalAudioTrack>(null)

  const onChange = (twilioRoomConnection: TwilioRoomConnection) => {
    setRemoteMemberships(twilioRoomConnection.toRemoteMemberships())
    setRemoteConnections(twilioRoomConnection.toRemoteConnections())

    setLocalParticipantTwilioParticipantSid(twilioRoomConnection.localParticipantTwilioParticipantSid)
    setLocalParticipantVideoTrack(twilioRoomConnection.localParticipantVideoTrack)
    setLocalParticipantAudioTrack(twilioRoomConnection.localParticipantAudioTrack)
  }

  useEffect(() => {
    let twilioRoomConnectionResolver: (twilioRoomConnection: TwilioRoomConnection) => void
    const twilioRoomConnectionPromise = new Promise<TwilioRoomConnection>((resolve) => { twilioRoomConnectionResolver = resolve })

    const connectAsync = async () => {
      const twilioRoomConnection = await TwilioRoomConnection.build({ twilioRoomSid, token, membershipId })

      twilioRoomConnection.onChange = onChange
      onChange(twilioRoomConnection)

      setTwilioRoomConnection(twilioRoomConnection)
      twilioRoomConnectionResolver(twilioRoomConnection)
    }

    connectAsync()

    return async () => {
      const twilioRoomConnection = await twilioRoomConnectionPromise
      twilioRoomConnection.disconnect()
    }
  }, [twilioRoomSid, token])

  useEffect(() => {
    if (!twilioRoomConnection || !localVideoTrack) {
      return;
    }

    twilioRoomConnection.localParticipant.publishTrack(localVideoTrack)
    return () => twilioRoomConnection.localParticipant.unpublishTrack(localVideoTrack)
  }, [twilioRoomConnection, localVideoTrack])

  useEffect(() => {
    if (!twilioRoomConnection || !localAudioTrack) {
      return;
    }

    twilioRoomConnection.localParticipant.publishTrack(localAudioTrack)
    return () => twilioRoomConnection.localParticipant.unpublishTrack(localAudioTrack)
  }, [twilioRoomConnection, localAudioTrack])

  useEffect(() => {
    if (!localAudioTrack) {
      return;
    }

    if (localAudioTrack.isEnabled && !localAudioTrackEnabled) {
      localAudioTrack.disable()
    } else if (!localAudioTrack.isEnabled && localAudioTrackEnabled) {
      localAudioTrack.enable()
    }
  }, [localAudioTrack, localAudioTrackEnabled])

  useEffect(() => {
    if (!localVideoTrack) {
      return;
    }

    if (localVideoTrack.isEnabled && videoMuted) {
      localVideoTrack.disable()
    } else if (!localVideoTrack.isEnabled && !videoMuted) {
      localVideoTrack.enable()
    }
  }, [localVideoTrack, videoMuted])

  return {
    remoteMemberships,
    remoteConnections,
    localParticipantVideoTrack,
    localParticipantAudioTrack,
    localParticipantTwilioParticipantSid
  }
}
