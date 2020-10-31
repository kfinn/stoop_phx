import useRemoteConnection from "hooks/useRemoteConnection";
import React, { useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import remoteMembershipIncomingAudioVolumeState from "state/remoteMembershipIncomingAudioVolumeState";

export default function RemoteMembershipAudioTrack({ id }: { id: string }) {
  const ref = useRef<HTMLAudioElement>(null)

  const { audioTrack } = useRemoteConnection(id)

  useEffect(() => {
    if (!audioTrack) {
      return;
    }

    audioTrack.attach(ref.current)

    return () => audioTrack.detach(ref.current)
  }, [audioTrack])


  const volume = useRecoilValue(remoteMembershipIncomingAudioVolumeState(id))

  useEffect(() => {
    ref.current.volume = volume
  }, [volume])

  return <audio ref={ref} autoPlay />
}
