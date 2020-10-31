import LocalParticipantVideoTrackContext from 'contexts/LocalParticipantVideoTrackContext';
import RemoteConnectionsContext from 'contexts/RemoteConnectionsContext';
import useConnectionRecentMaxVolumes from 'hooks/useConnectionRecentMaxVolumes';
import useLocalMembershipSync from 'hooks/useLocalMembershipSync';
import useTwilioRoom from 'hooks/useTwilioRoom';
import useWarnBeforeQuitting from 'hooks/useWarnBeforeQuitting';
import React, { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useRecoilState, useSetRecoilState } from 'recoil';
import membershipRecentMaxVolumesState from 'state/membershipRecentMaxVolumesState';
import mutedState from 'state/mutedState';
import remoteMembershipsState from 'state/remoteMembershipsState';
import shoutingState from 'state/shoutingState';
import twilioParticipantSidState from 'state/twilioParticipantSidState';
import videoMutedState from 'state/videoMutedState';
import HotkeysDialog from './HotkeysDialog';
import MuteButton from './MuteButton';
import SettingsButton from './SettingsButton';
import SettingsDialog from './SettingsDialog';
import ShoutButton from './ShoutButton';
import VideoGrid from './VideoGrid';
import VideoMuteButton from './VideoMuteButton';


interface RoomInit {
  membershipId: string
  twilioRoomSid: string
  roomAccessToken: string
}

export default function Room({ membershipId, twilioRoomSid, roomAccessToken }: RoomInit) {
  const [muted, setMuted] = useRecoilState(mutedState)
  const [videoMuted, setVideoMuted] = useRecoilState(videoMutedState)

  useLocalMembershipSync(membershipId)
  useWarnBeforeQuitting()

  const {
    remoteMemberships,
    remoteConnections, 
    localParticipantVideoTrack,
    localParticipantAudioTrack,
    localParticipantTwilioParticipantSid,
  } = useTwilioRoom({ twilioRoomSid, token: roomAccessToken })

  const localParticipantConnection = {
    membershipId,
    audioTrack: localParticipantAudioTrack
  }
  
  const setMembershipRecentMaxVolumes = useSetRecoilState(membershipRecentMaxVolumesState)
  const connectionRecentMaxVolumes = useConnectionRecentMaxVolumes([...remoteConnections, localParticipantConnection])

  useEffect(() => {
    setMembershipRecentMaxVolumes(connectionRecentMaxVolumes)
  }, [connectionRecentMaxVolumes])

  const setRemoteMemberships = useSetRecoilState(remoteMembershipsState)
  const setTwilioParticipantSid = useSetRecoilState(twilioParticipantSidState)

  useEffect(() => {
    setRemoteMemberships(remoteMemberships)
  }, [remoteMemberships])
  useEffect(() => {
    setTwilioParticipantSid(localParticipantTwilioParticipantSid)
  }, [localParticipantTwilioParticipantSid])

  const [settingsVisible, setSettingsVisible] = useState(false)
  const [shouting, setShouting] = useRecoilState(shoutingState)

  const [hotkeysVisible, setHotkeysVisible] = useState(false)
  useHotkeys('shift+/', () => setHotkeysVisible(!hotkeysVisible), [hotkeysVisible])
  useHotkeys('m', () => setMuted(!muted), [muted])
  useHotkeys('v', () => setVideoMuted(!videoMuted), [videoMuted])
  useHotkeys('shift+s', () => setShouting(!shouting), [shouting])
  useHotkeys('s', () => setSettingsVisible(!settingsVisible), [settingsVisible])

  return <RemoteConnectionsContext.Provider value={remoteConnections}>
    <LocalParticipantVideoTrackContext.Provider value={localParticipantVideoTrack}>
      <VideoGrid />
      <div className="actions">
        <ShoutButton />
        <MuteButton />
        <VideoMuteButton />
        <SettingsButton onClick={() => setSettingsVisible(true)} />
      </div>
      <SettingsDialog show={settingsVisible} onHide={() => setSettingsVisible(false)} />
      <HotkeysDialog show={hotkeysVisible} onHide={() => setHotkeysVisible(false)} />
    </LocalParticipantVideoTrackContext.Provider>
  </RemoteConnectionsContext.Provider>
}
