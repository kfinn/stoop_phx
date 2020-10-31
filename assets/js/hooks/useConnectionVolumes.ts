import _ from "lodash";
import MediaStreamTrackAnalyser from "models/MediaStreamTrackAnalyser";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import backgroundAudioEnabledState from "state/backgroundAudioEnabledState";
import Video from "twilio-video";

export interface AudioConnection {
  membershipId: string
  audioTrack: Video.AudioTrack
}

interface MediaStreamAnalyserCollection {
  [membershipId: string]: MediaStreamTrackAnalyser
}

export interface VolumesByMembershipId {
  [membershipId: string]: number
}

export default function useConnectionVolumes(connections: AudioConnection[]): VolumesByMembershipId {
  const backgroundAudioEnabled = useRecoilValue(backgroundAudioEnabledState)

  const mediaStreamAnalysersRef = useRef<MediaStreamAnalyserCollection>({})
  const [volumesByMembershipId, setVolumesByMembershipId] = useState<VolumesByMembershipId>({})

  useEffect(() => {
    if (!backgroundAudioEnabled) {
      const mediaStreamAnalysers = mediaStreamAnalysersRef.current
      mediaStreamAnalysersRef.current = {}

      _.each(
        mediaStreamAnalysers,
        (mediaStreamAnalyser) => {
          mediaStreamAnalyser.disconnect()
        }
      )

      return;
    }

    const connectionsWithAudioTracks = _.filter(connections, (connection) => !!connection.audioTrack)

    _.each(
      connectionsWithAudioTracks,
      ({ membershipId, audioTrack: { mediaStreamTrack } }) => {
        let mediaStreamTrackAnalyser = mediaStreamAnalysersRef.current[membershipId]
        if (mediaStreamTrackAnalyser) {
          mediaStreamTrackAnalyser.mediaStreamTrack = mediaStreamTrack
        } else {
          mediaStreamAnalysersRef.current[membershipId] = new MediaStreamTrackAnalyser(mediaStreamTrack)
        }
      }
    )

    const currentMembershipIds = _.map(connectionsWithAudioTracks, 'membershipId')
    const membershipIdsWithMediaStreamAnalysers = _.map(
      mediaStreamAnalysersRef.current,
      (_mediaStreamTrackAnalyser, membershipId) => membershipId
    )
    const membershipIdsToDisconnect = _.difference(membershipIdsWithMediaStreamAnalysers, currentMembershipIds)
    _.each(
      membershipIdsToDisconnect,
      (membershipId) => {
        mediaStreamAnalysersRef.current[membershipId].disconnect()
        delete mediaStreamAnalysersRef.current[membershipId]
      }
    )
  }, [connections, backgroundAudioEnabled])

  useEffect(() => {
    const interval = setInterval(() => {
      const volumesByMembershipId = {}
      _.each(
        mediaStreamAnalysersRef.current,
        (mediaStreamTrackAnalyser, membershipId) => {
          volumesByMembershipId[membershipId] = mediaStreamTrackAnalyser.getVolume()
        }
      )
      setVolumesByMembershipId(volumesByMembershipId)
    })

    return () => {
      clearInterval(interval)
    }
  })

  useEffect(() => {
    return () => {
      _.each(
        mediaStreamAnalysersRef.current,
        (mediaStreamAnalyser) => mediaStreamAnalyser.disconnect()
      )
    }
  }, [])

  return volumesByMembershipId
}
