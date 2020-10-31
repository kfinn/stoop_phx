import React from "react"
import { useState } from "react"
import Room from "./Room"
import useSubscription from "hooks/useSubscription"

enum RoomChannelEvent {
  CONNECTED = 'connected',
  UPDATED = 'updated'
}

interface RoomAuthentication {
  twilioRoomSid: string
  roomAccessToken: string
}

export default function AuthenticatedRoom({ id, membershipId }: { id: string, membershipId: string }) {
  const [roomAuthentication, setRoomAuthentication] = useState<RoomAuthentication>()

  useSubscription(
    {
      name: 'room',
      id: id
    },
    {
      [RoomChannelEvent.CONNECTED]: (newValue) => { console.log(newValue); setRoomAuthentication(newValue) },
      [RoomChannelEvent.UPDATED]: (newValue) => { console.log(newValue); setRoomAuthentication(newValue) }
    }
  )

  if (!roomAuthentication) {
    return <div>loading...</div>
  }

  console.log('have roomAuthentication, rendering')
  return <Room membershipId={membershipId} {...roomAuthentication} />
}
