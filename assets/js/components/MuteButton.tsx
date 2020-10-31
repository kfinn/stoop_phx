import { useRecoilState } from "recoil"
import mutedState from "state/mutedState"
import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons'

export default function MuteButton() {
    const [muted, setMuted] = useRecoilState(mutedState)
    const onClick = () => setMuted(!muted)
    return <button role="button" className="action-button btn btn-link btn-link text-secondary" onClick={onClick}>
        {
            muted ? (
                <FontAwesomeIcon icon={faMicrophoneSlash} />
            ) : (
                <FontAwesomeIcon icon={faMicrophone} />
            )
        }
    </button>
}
