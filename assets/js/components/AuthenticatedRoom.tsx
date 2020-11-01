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

export default function AuthenticatedRoom({ membershipId }: { membershipId: string }) {
  const [roomAuthentication, setRoomAuthentication] = useState<RoomAuthentication>()

  useSubscription(
    "room",
    {
      [RoomChannelEvent.CONNECTED]: setRoomAuthentication,
      [RoomChannelEvent.UPDATED]: setRoomAuthentication
    }
  )

  if (!roomAuthentication) {
    return <div>loading...</div>
  }

  return <Room membershipId={membershipId} {...roomAuthentication} />
}
