import _ from "lodash";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import isUserMediaAvailableState from "state/isUserMediaAvailableState";
import videoInputDeviceIdState from "state/videoInputDeviceIdState";
import Video, { LocalAudioTrack } from "twilio-video";

export default function useLocalAudioTrack(props: { deviceId?: string } = {}): LocalAudioTrack {
  const [localAudioTrack, setLocalAudioTrack] = useState<LocalAudioTrack>(null)
  const defaultDeviceId = useRecoilValue(videoInputDeviceIdState)
  const deviceId = _.get(props, 'deviceId', defaultDeviceId)

  const setIsUserMediaAvailable = useSetRecoilState(isUserMediaAvailableState)

  useEffect(() => {
    let localAudioTrackResolver: (mediaStream: LocalAudioTrack) => void
    let localAudioTrackPromise = new Promise<LocalAudioTrack>((resolve) => { localAudioTrackResolver = resolve })

    const findOrCreateLocalAudioTrack = async () => {
      const localAudioTrack = await Video.createLocalAudioTrack(deviceId ? { deviceId } : {})
      setIsUserMediaAvailable(true)
      setLocalAudioTrack(localAudioTrack)
      localAudioTrackResolver(localAudioTrack)
    }

    findOrCreateLocalAudioTrack()

    return async () => {
      const localAudioTrack = await localAudioTrackPromise
      localAudioTrack.stop()
    }
  }, [deviceId])

  return localAudioTrack
}
