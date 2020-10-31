import React, { Suspense } from "react";
import { Modal } from 'react-bootstrap';
import RoomConfigForm from "./RoomConfigForm";

export default function SettingsDialog({ show, onHide }: { show: boolean, onHide: () => void }) {
    return <Modal show={show} onHide={onHide} >
        <Modal.Header closeButton>
            <Modal.Title>
                Settings
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Suspense fallback={'loading...'}>
                <RoomConfigForm onComplete={onHide} />
            </Suspense>
        </Modal.Body>
    </Modal>
}
