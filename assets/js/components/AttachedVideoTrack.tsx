import React, { useEffect } from "react";
import { useRef } from "react";
import { VideoTrack } from "twilio-video";

type HTMLVideoProps = React.DetailedHTMLProps<React.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>
interface AddedProps {
  videoTrack: VideoTrack
}

type Props = HTMLVideoProps & AddedProps

export default function AttachedVideoTrack({ videoTrack, ...htmlVideoProps }: Props) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!videoTrack) {
      return;
    }
    
    videoTrack.attach(ref.current)

    return () => videoTrack.detach(ref.current)
  }, [videoTrack])

  return <video ref={ref} {...htmlVideoProps} />
}
