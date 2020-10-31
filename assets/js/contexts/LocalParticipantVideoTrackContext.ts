import { createContext } from "react";
import Video from "twilio-video";

const LocalParticipantVideoTrackContext = createContext(null as Video.LocalVideoTrack)
export default LocalParticipantVideoTrackContext
