import classNames from "classnames";
import { VOLUME_RANGE } from "hooks/useConnectionRecentMaxVolumes";
import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { AudioTrack } from "twilio-video";
import useAudioContext from "../hooks/useAudioContext";

export const MIN_VOLUME = 128
export const MAX_VOLUME = 256
const CELLS_COUNT = 12
const FFT_SIZE = 2048

export default function VolumeVisualizer({ audioTrack }: { audioTrack: AudioTrack }) {
    const audioContext = useAudioContext()
    const analyserRef = useRef<AnalyserNode>(null)
    const [latestVolumeSample, setLatestVolumeSample] = useState(MIN_VOLUME)

    useEffect(() => {
        if (!audioTrack) {
            return;
        }
        
        const audioSource = audioContext.createMediaStreamSource(new MediaStream([audioTrack.mediaStreamTrack]))
        const analyser = audioContext.createAnalyser()
        
        audioSource.connect(analyser)
        analyser.fftSize = FFT_SIZE
        analyserRef.current = analyser

        return () => {
            analyser.disconnect()
            audioSource.disconnect()
        }
    }, [audioTrack])

    useEffect(() => {
        const buffer = new Uint8Array(FFT_SIZE)
        const interval = setInterval(() => {
            if (!analyserRef.current) {
                return
            }

            const analyser = analyserRef.current
            analyser.getByteTimeDomainData(buffer)
            setLatestVolumeSample(_.max(_.map(buffer, Math.abs)))
        }, 50)

        return () => {
            clearInterval(interval)
        }
    }, [])

    const activeCellsCount = _.floor(((latestVolumeSample - MIN_VOLUME) / VOLUME_RANGE) * CELLS_COUNT)

    return <div className="volume-visualizer">
        {
            _.map(_.range(CELLS_COUNT), (cellIndex) => (
                <div
                    key={cellIndex}
                    className={classNames('volume-visualizer-cell', { active: activeCellsCount > cellIndex })}
                />
            ))
        }
    </div>
}
