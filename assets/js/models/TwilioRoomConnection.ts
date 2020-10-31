import { RemoteConnection } from "contexts/RemoteConnectionsContext";
import _ from "lodash";
import { RemoteMembership } from "state/remoteMembershipsState";
import Video from "twilio-video";
import TwilioRemoteParticipantConnection from "./TwilioRemoteParticipantConnection";

interface TwilioRoomInit {
  twilioRoomSid: string
  token: string
  membershipId: string
}

interface HackyEventEmitter {
  on: (eventName: string, callback: (event: any) => void) => void
}

export default class TwilioRoomConnection {
  room: Video.Room
  membershipId: string

  twilioRemoteParticipantConnections: { [twilioParticipantSid: string]: TwilioRemoteParticipantConnection } = {}

  onChange: (twilioRoomConnection: TwilioRoomConnection) => void

  constructor(room: Video.Room, membershipId: string) {
    this.room = room
    this.membershipId = membershipId

    const roomEventEmitter = room as unknown as HackyEventEmitter
    roomEventEmitter.on('disconnected', this.onRoomEvent)
    roomEventEmitter.on('participantConnected', this.onRoomEvent)
    roomEventEmitter.on('participantDisconnected', this.onRoomEvent)
    roomEventEmitter.on('participantReconnected', this.onRoomEvent)
    roomEventEmitter.on('participantReconnecting', this.onRoomEvent)
    roomEventEmitter.on('reconnected', this.onRoomEvent)
    roomEventEmitter.on('reconnecting', this.onRoomEvent)
    roomEventEmitter.on('recordingStarted', this.onRoomEvent)
    roomEventEmitter.on('recordingStopped', this.onRoomEvent)
    roomEventEmitter.on('trackDimensionsChanged', this.onRoomEvent)
    roomEventEmitter.on('trackDisabled', this.onRoomEvent)
    roomEventEmitter.on('trackEnabled', this.onRoomEvent)
    roomEventEmitter.on('trackMessage', this.onRoomEvent)
    roomEventEmitter.on('trackPublished', this.onRoomEvent)
    roomEventEmitter.on('trackPublishPriorityChanged', this.onRoomEvent)
    roomEventEmitter.on('trackStarted', this.onRoomEvent)
    roomEventEmitter.on('trackSubscribed', this.onRoomEvent)
    roomEventEmitter.on('trackSwitchedOff', this.onRoomEvent)
    roomEventEmitter.on('trackSwitchedOn', this.onRoomEvent)
    roomEventEmitter.on('trackUnpublished', this.onRoomEvent)
    roomEventEmitter.on('trackUnsubscribed', this.onRoomEvent)

    const localParticipantEventEmitter = room.localParticipant as unknown as HackyEventEmitter
    localParticipantEventEmitter.on('trackDimensionsChanged', this.onRoomEvent)
    localParticipantEventEmitter.on('trackDisabled', this.onRoomEvent)
    localParticipantEventEmitter.on('trackEnabled', this.onRoomEvent)
    localParticipantEventEmitter.on('trackPublicationFailed', this.onRoomEvent)
    localParticipantEventEmitter.on('trackPublished', this.onRoomEvent)
    localParticipantEventEmitter.on('trackStarted', this.onRoomEvent)
    localParticipantEventEmitter.on('trackStopped', this.onRoomEvent)
  }

  static async build({ twilioRoomSid, token, membershipId }: TwilioRoomInit): Promise<TwilioRoomConnection> {
    // recommended settings taken from twilio docs
    // https://www.twilio.com/docs/video/tutorials/developing-high-quality-video-applications#collaboration-mode
    const room = await Video.connect(
      token,
      {
        name: twilioRoomSid,
        audio: false,
        video: false,
        bandwidthProfile: {
          video: {
            mode: 'collaboration',
            maxTracks: 10,
            renderDimensions: {
              high: { height: 1080, width: 1920 },
              standard: { height: 720, width: 1280 },
              low: { height: 176, width: 144 }
            }
          }
        },
        maxAudioBitrate: 16000,
        preferredVideoCodecs: [{ codec: 'VP8', simulcast: true }],
        networkQuality: { local: 1, remote: 1 }
      }
    )

    return new TwilioRoomConnection(room, membershipId)
  }

  onRoomEvent = (event: any) => {
    this.syncParticipants()

    if (this.onChange) {
      this.onChange(this)
    }
  }

  syncParticipants = () => {
    _.each(
      Array.from(this.room.participants.entries()),
      ([remoteParticipantSid, remoteParticipant]) => {
        if (!_.has(this.twilioRemoteParticipantConnections, remoteParticipantSid)) {
          const twilioRemoteParticipantConnection = new TwilioRemoteParticipantConnection(remoteParticipant, this.membershipId)
          twilioRemoteParticipantConnection.onChange = () => { this.onChange(this) }
          this.twilioRemoteParticipantConnections[remoteParticipantSid] = twilioRemoteParticipantConnection
        }
      }
    )

    const remoteParticipantSidsToDestroy = _.filter(
      _.keys(this.twilioRemoteParticipantConnections),
      (remoteParticipantSid) => !this.room.participants.has(remoteParticipantSid)
    )
    _.each(
      remoteParticipantSidsToDestroy,
      (remoteParticipantSid) => {
        this.twilioRemoteParticipantConnections[remoteParticipantSid].unsubscribe()
        delete this.twilioRemoteParticipantConnections[remoteParticipantSid]
      }
    )
  }

  disconnect = () => {
    this.room.disconnect()
    _.each(
      _.values(this.twilioRemoteParticipantConnections),
      (twilioRemoteParticipantConnection) => twilioRemoteParticipantConnection.unsubscribe()
    )
    this.twilioRemoteParticipantConnections = {}
  }

  toRemoteMemberships: () => RemoteMembership[] = () => {
    return _.compact(_.map(_.values(this.twilioRemoteParticipantConnections), 'remoteMembership'))
  }

  toRemoteConnections: () => RemoteConnection[] = () => {
    return _.map(
      _.values(this.twilioRemoteParticipantConnections), 
      (twilioRemoteParticipantConnection) => (
        twilioRemoteParticipantConnection.toRemoteConnection()
      )
    )
  }

  get localParticipant(): Video.LocalParticipant {
    return this.room.localParticipant
  }

  get localParticipantVideoTrack(): Video.LocalVideoTrack {
    return _.get(_.first(Array.from(this.localParticipant.videoTracks.values())), 'track')
  }

  get localParticipantAudioTrack(): Video.LocalAudioTrack {
    return _.get(_.first(Array.from(this.localParticipant.audioTracks.values())), 'track')
  }

  get localParticipantTwilioParticipantSid(): string {
    return _.get(this.localParticipant, 'sid')
  }
}
