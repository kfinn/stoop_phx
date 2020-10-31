import { configureSocket } from "channels/consumer"
import React, { Suspense, useEffect, useState } from "react"
import { RecoilRoot } from "recoil"
import audioInputDeviceIdState from "state/audioInputDeviceIdState"
import membershipIdState from "state/membershipIdState"
import nameState from "state/nameState"
import videoInputDeviceIdState from "state/videoInputDeviceIdState"
import AuthenticatedRoom from "./AuthenticatedRoom"
import RoomPreview from "./RoomPreview"

interface Props {
    roomId: string
    membershipId: string
    membershipToken: string
}

export default function RoomsShow({ roomId, membershipId, membershipToken }: Props) {
    useEffect(() => {
        configureSocket(membershipToken)
    }, [])

    const [roomConfigSubmitted, setRoomConfigSubmitted] = useState(false)
    return <RecoilRoot initializeState={({ set }) => {
        set(membershipIdState, membershipId)
        set(nameState, localStorage.getItem('nameState'))
        set(videoInputDeviceIdState, localStorage.getItem('videoInputDeviceIdState'))
        set(audioInputDeviceIdState, localStorage.getItem('audioInputDeviceIdState'))
    }}>
        <Suspense fallback={'loading...'}>
            {
                roomConfigSubmitted ? (
                    <AuthenticatedRoom id={roomId} membershipId={membershipId} />
                ) : (
                        <RoomPreview onSubmit={() => setRoomConfigSubmitted(true)} />
                    )
            }
        </Suspense>
    </RecoilRoot>
}
