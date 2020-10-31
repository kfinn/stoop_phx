import { faBullhorn, faMicrophoneSlash, faVideoSlash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classnames"
import LocalParticipantVideoTrackContext from "contexts/LocalParticipantVideoTrackContext"
import React, { useContext } from "react"
import { useRecoilValue } from "recoil"
import mutedState from "state/mutedState"
import nameState from "state/nameState"
import shoutingState from "state/shoutingState"
import videoMutedState from "state/videoMutedState"
import AttachedVideoTrack from "./AttachedVideoTrack"

export default function SelfVideo() {
  const localParticipantVideoTrack = useContext(LocalParticipantVideoTrackContext)

  const name = useRecoilValue(nameState)
  const muted = useRecoilValue(mutedState)
  const videoMuted = useRecoilValue(videoMutedState)
  const shouting = useRecoilValue(shoutingState)

  return <div className={classNames("video-container", { shouting })}>
    {localParticipantVideoTrack && <AttachedVideoTrack videoTrack={localParticipantVideoTrack} autoPlay className="video mirrored" style={{ display: videoMuted ? 'none' : 'block' }}/>}
    <div className={classNames("video-actions", { "show": videoMuted })}>
      <div className="text-light">{name} (you)</div>
    </div>
    <div className="video-status">
      {
          muted && (
            <FontAwesomeIcon icon={faMicrophoneSlash} />
          )
      }
      {
        videoMuted && (
          <FontAwesomeIcon icon={faVideoSlash} />
        )
      }
      {
        shouting && (
          <FontAwesomeIcon icon={faBullhorn} />
        )
      }

    </div>
  </div>
}
