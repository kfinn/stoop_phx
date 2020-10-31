import { faBullhorn } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from "react"
import { useRecoilState } from "recoil"
import shoutingState from "state/shoutingState"

export default function ShoutButton() {
  const [shouting, setShouting] = useRecoilState(shoutingState)
  if (shouting) {
    return <button role="button" className="action-button btn btn-primary" onClick={() => setShouting(false)}>
      <FontAwesomeIcon icon={faBullhorn} />
    </button>
  } else {
    return <button role="button" className="action-button btn btn-link text-secondary" onClick={() => setShouting(true)}>
      <FontAwesomeIcon icon={faBullhorn} />
    </button>
  }
}
