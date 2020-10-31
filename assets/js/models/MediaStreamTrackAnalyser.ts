import { getAudioContext } from "hooks/useAudioContext"
import _ from "lodash"

const FFT_SIZE = 2048

export default class MediaStreamTrackAnalyser {
  mediaStreamTrack: MediaStreamTrack
  sourceNode: MediaStreamAudioSourceNode
  analyserNode: AnalyserNode

  constructor(mediaStreamTrack: MediaStreamTrack) {
    const audioContext = getAudioContext()
    const analyserNode = audioContext.createAnalyser()
    analyserNode.fftSize = FFT_SIZE
    this.analyserNode = analyserNode

    this.setMediaStreamTrack(mediaStreamTrack)
  }

  setMediaStreamTrack = (mediaStreamTrack: MediaStreamTrack) => {
    if (this.mediaStreamTrack === mediaStreamTrack) {
      return;
    }


    if (this.sourceNode) {
      this.sourceNode.disconnect()
    }

    this.mediaStreamTrack = mediaStreamTrack

    if (mediaStreamTrack) {
      const sourceNode = getAudioContext().createMediaStreamSource(new MediaStream([mediaStreamTrack]))
      sourceNode.connect(this.analyserNode)
      this.sourceNode = sourceNode
    }
  }

  disconnect = () => {
    this.analyserNode.disconnect()
    this.sourceNode.disconnect()
  }

  getVolume = () => {
    const buffer = new Uint8Array(FFT_SIZE)
    this.analyserNode.getByteTimeDomainData(buffer)
    const volume = _.max(_.map(buffer, (sample) => Math.abs(sample)))
    return _.max(_.map(buffer, (sample) => Math.abs(sample)))
    // return MAX_VOLUME
  }
}
