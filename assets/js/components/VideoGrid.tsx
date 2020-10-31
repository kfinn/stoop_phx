import _ from "lodash"
import React, { useCallback, useEffect, useLayoutEffect, useRef } from "react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import activeRemoteMembershipsState from "state/activeRemoteMembershipsState"
import membershipIdState from "state/membershipIdState"
import participantGridSizeState from "state/participantGridSizeState"
import RemoteMembershipVideo from "./RemoteMembershipVideo"
import SelfVideo from "./SelfVideo"
import VideoCell from "./VideoCell"

export default function VideoGrid() {
  const membershipId = useRecoilValue(membershipIdState)
  const activeRemoteMemberships = useRecoilValue(activeRemoteMembershipsState)

  const fullscreenVideoRef = useRef<HTMLDivElement>(null)
  const setVideoGridSize = useSetRecoilState(participantGridSizeState)

  const updateLayout = useCallback(() => {
    if (!fullscreenVideoRef.current) {
      return;
    }

    setVideoGridSize({
      width: fullscreenVideoRef.current.offsetWidth,
      height: fullscreenVideoRef.current.offsetHeight
    })
  }, [])

  useLayoutEffect(updateLayout)
  useEffect(() => {
    window.addEventListener('resize', updateLayout)
    return () => window.removeEventListener('resize', updateLayout)
  }, [])

  return <div ref={fullscreenVideoRef} className="video-grid fullscreen">
    <VideoCell membershipId={membershipId}>
      <SelfVideo />
    </VideoCell>
    {
      _.map(activeRemoteMemberships, ({ id }) => (
        <VideoCell membershipId={id} key={id}>
          <RemoteMembershipVideo id={id} />
        </VideoCell>
      ))
    }
  </div>
}
