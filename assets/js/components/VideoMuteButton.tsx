import { faVideo, faVideoSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import videoMutedState from "state/videoMutedState";

export default function VideoMuteButton() {
    const [videoMuted, setVideoMuted] = useRecoilState(videoMutedState)
    const onClick = () => { setVideoMuted(!videoMuted)}

    return <button role="button" className="action-button btn btn-link btn-link text-secondary" onClick={onClick}>
        {
            videoMuted ? (
                <FontAwesomeIcon icon={faVideoSlash} />
            ) : (
                    <FontAwesomeIcon icon={faVideo} />
                )
        }
    </button>
}
