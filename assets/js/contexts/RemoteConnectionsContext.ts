import { Subscription } from "hooks/useSubscription";
import { createContext } from "react";
import Video from "twilio-video";

export interface RemoteConnection {
  membershipId: string
  audioTrack: Video.RemoteAudioTrack
  videoTrack: Video.RemoteVideoTrack
  subscription: Subscription
}

const RemoteConnectionsContext = createContext([] as RemoteConnection[])
export default RemoteConnectionsContext
