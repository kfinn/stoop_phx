import useLocalAudioTrack from "hooks/useLocalAudioTrack";
import useLocalVideoTrack from "hooks/useLocalVideoTrack";
import _ from "lodash";
import React, { FormEvent, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useRecoilState, useRecoilValue } from "recoil";
import audioInputDeviceIdState from "state/audioInputDeviceIdState";
import availableAudioInputsState from "state/availableAudioInputsState";
import { useSyncAvailableMediaDevices } from "state/availableMediaDevicesState";
import availableVideoInputsState from "state/availableVideoInputsState";
import backgroundAudioEnabledState from "state/backgroundAudioEnabledState";
import nameState from "state/nameState";
import videoInputDeviceIdState from "state/videoInputDeviceIdState";
import AttachedVideoTrack from "./AttachedVideoTrack";
import VolumeVisualizer from "./VolumeVisualizer";

export default function RoomConfigForm({ onComplete }: { onComplete: () => void }) {
    const [name, setName] = useRecoilState(nameState)
    const [formName, setFormName] = useState(name || '')

    const onNameChange = ({ target: { value } }) => {
        setFormName(value)
    }

    useSyncAvailableMediaDevices()
    const [videoInputDeviceId, setVideoInputDeviceId] = useRecoilState(videoInputDeviceIdState)
    const [previewVideoInputDeviceId, setPreviewVideoInputDeviceId] = useState(videoInputDeviceId)
    const availableVideoInputs = useRecoilValue(availableVideoInputsState)

    const onChangeVideoInputDeviceId = ({ target: { value } }) => {
        setPreviewVideoInputDeviceId(value == 'default' ? null : value)
    }

    const [audioInputDeviceId, setAudioInputDeviceId] = useRecoilState(audioInputDeviceIdState)
    const [previewAudioInputDeviceId, setPreviewAudioInputDeviceId] = useState(audioInputDeviceId)
    const availableAudioInputs = useRecoilValue(availableAudioInputsState)

    const onChangeAudioInputDeviceId = ({ target: { value } }) => {
        setPreviewAudioInputDeviceId(value == 'default' ? null : value)
    }

    const localVideoTrack = useLocalVideoTrack({ deviceId: previewVideoInputDeviceId })
    const localAudioTrack = useLocalAudioTrack({ deviceId: previewAudioInputDeviceId })

    const onSubmit = (event: FormEvent) => {
        event.preventDefault()
        setName(formName)
        if (formName) {
            localStorage.setItem('nameState', formName)
        } else {
            localStorage.removeItem('nameState')
        }
        setVideoInputDeviceId(previewVideoInputDeviceId)
        if (previewVideoInputDeviceId) {
            localStorage.setItem('videoInputDeviceIdState', previewVideoInputDeviceId)
        } else {
            localStorage.removeItem('videoInputDeviceIdState')
        }
        setAudioInputDeviceId(previewAudioInputDeviceId)
        if (previewAudioInputDeviceId) {
            localStorage.setItem('audioInputDeviceIdState', previewAudioInputDeviceId)
        } else {
            localStorage.removeItem('audioInputDeviceIdState')
        }
        onComplete()
    }

    const [backgroundAudioEnabled, setBackgroundAudioEnabled] = useRecoilState(backgroundAudioEnabledState)
    const onChangeBackgroundAudioEnabled = ({ target: { value } }) => {
        setBackgroundAudioEnabled(value == 'enabled')
    }

    return <Form onSubmit={onSubmit}>
        <Form.Group as={Row}>
            <Form.Label column sm={2} xl={3}>Name</Form.Label>
            <Col sm={8}>
                <Form.Control type="text" placeholder="Name" value={formName} onChange={onNameChange}></Form.Control>
            </Col>
        </Form.Group>
        <Form.Group as={Row}>
            <Form.Label column sm={2} xl={3}>Camera</Form.Label>
            <Col sm={8}>
                <Form.Control as="select" value={previewVideoInputDeviceId || 'default'} onChange={onChangeVideoInputDeviceId}>
                    <option value="default">Default</option>
                    {
                        _.map(availableVideoInputs, ({ deviceId, label }) => (
                            <option key={deviceId} value={deviceId}>{label || deviceId}</option>
                        ))
                    }
                </Form.Control>
            </Col>
        </Form.Group>
        <Row className="justify-content-center">
            <Col sm={12} md={8} lg={6} xl={5}>
                <AttachedVideoTrack videoTrack={localVideoTrack} className="mirrored" autoPlay muted width="100%" />
            </Col>
        </Row>
        <Form.Group as={Row}>
            <Form.Label column sm={2} xl={3}>Microphone</Form.Label>
            <Col sm={8}>
                <Form.Control as="select" value={previewAudioInputDeviceId || 'default'} onChange={onChangeAudioInputDeviceId}>
                    <option value="default">Default</option>
                    {
                        _.map(availableAudioInputs, ({ deviceId, label }) => (
                            <option key={deviceId} value={deviceId}>{label || deviceId}</option>
                        ))
                    }
                </Form.Control>
            </Col>
        </Form.Group>
        <Row className="justify-content-center">
            <Col sm={12} md={8} lg={6} xl={5}>
                <VolumeVisualizer audioTrack={localAudioTrack} />
            </Col>
        </Row>
        <Form.Group as={Row}>
            <Form.Label column sm={2} xl={3}>Background Audio</Form.Label>
            <Col sm={8}>
                <Form.Control as="select" value={backgroundAudioEnabled ? 'enabled' : 'disabled'} onChange={onChangeBackgroundAudioEnabled}>
                    <option value="enabled">Enabled</option>
                    <option value="disabled">Disabled</option>
                </Form.Control>
            </Col>
        </Form.Group>
        <Row className="justify-content-center my-3">
            <Button type="submit" onClick={onSubmit}>Save</Button>
        </Row>
    </Form>
}
