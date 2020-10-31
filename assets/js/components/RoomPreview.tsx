import React, { useState } from "react";
import { Button, Container, Row } from "react-bootstrap";
import { useRecoilValue } from "recoil";
import audioInputDeviceIdState from "state/audioInputDeviceIdState";
import nameState from "state/nameState";
import videoInputDeviceIdState from "state/videoInputDeviceIdState";
import RoomConfigForm from "./RoomConfigForm";

export default function RoomPreview({ onSubmit }: { onSubmit: () => void }) {
    const [roomConfigFormVisible, setRoomConfigFormVisible] = useState(false)

    const name = useRecoilValue(nameState)
    const videoInputDeviceId = useRecoilValue(videoInputDeviceIdState)
    const audioInputDeviceId = useRecoilValue(audioInputDeviceIdState)

    return <Container>
        <h1>Join Room</h1>
        {
            roomConfigFormVisible ? (
                <RoomConfigForm onComplete={() => setRoomConfigFormVisible(false)} />
            ) : (
                <React.Fragment>
                    <Row className="justify-content-center">
                        Joining as {name || "User"}.
                    </Row>
                    {
                        videoInputDeviceId && (
                            <Row className="justify-content-center">Camera selected</Row>
                        )
                    }
                    {
                        audioInputDeviceId && (
                            <Row className="justify-content-center">Microphone selected</Row>
                        )
                    }
                    <Row className="justify-content-center my-3">
                        <Button type="submit" variant="success" onClick={onSubmit}>Join</Button>
                    </Row>
                    <Row className="justify-content-center my-3">
                        <Button type="button" variant="secondary" onClick={() => setRoomConfigFormVisible(true)}>Settings...</Button>
                    </Row>
                </React.Fragment>
            )
        }
    </Container>
}
