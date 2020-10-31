import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function SettingsButton({ onClick }: { onClick: () => void }) {
    return <button role="button" className="action-button btn btn-link text-secondary" onClick={onClick}>
        <FontAwesomeIcon icon={faEllipsisV} />
    </button>
}
