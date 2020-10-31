import _ from "lodash";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import isUserMediaAvailableState from "state/isUserMediaAvailableState";
import videoInputDeviceIdState from "state/videoInputDeviceIdState";
import Video, { LocalVideoTrack } from "twilio-video";

export default function useLocalVideoTrack(props: { deviceId?: string } = {}): LocalVideoTrack {
    const [localVideoTrack, setLocalVideoTrack] = useState<LocalVideoTrack>(null)
    const defaultDeviceId = useRecoilValue(videoInputDeviceIdState)
    const deviceId = _.get(props, 'deviceId', defaultDeviceId)

    const setIsUserMediaAvailable = useSetRecoilState(isUserMediaAvailableState)

    useEffect(() => {
        let localVideoTrackResolver: (mediaStream: LocalVideoTrack) => void
        let localVideoTrackPromise = new Promise<LocalVideoTrack>((resolve) => { localVideoTrackResolver = resolve })

        const findOrCreateLocalVideoTrack = async () => {
            const localVideoTrack = await Video.createLocalVideoTrack(deviceId ? { deviceId } : {})
            setIsUserMediaAvailable(true)
            setLocalVideoTrack(localVideoTrack)
            localVideoTrackResolver(localVideoTrack)
        }

        findOrCreateLocalVideoTrack()

        return async () => {
            const localVideoTrack = await localVideoTrackPromise
            localVideoTrack.stop()
        }
    }, [deviceId])

    return localVideoTrack
}
