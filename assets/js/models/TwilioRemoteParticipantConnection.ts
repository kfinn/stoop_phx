import consumer from "channels/consumer";
import { RemoteConnection } from "contexts/RemoteConnectionsContext";
import _ from "lodash";
import { RemoteMembership } from "state/remoteMembershipsState";
import Video from "twilio-video";

export default class TwilioRemoteParticipantConnection {
  remoteParticipant: Video.RemoteParticipant
  remoteMembership: RemoteMembership
  subscription: any

  onChange: (twilioRemoteParticipantConnection: TwilioRemoteParticipantConnection) => void

  constructor(remoteParticipant: Video.RemoteParticipant, membershipId: string) {
    this.remoteParticipant = remoteParticipant
    this.remoteMembership = null

    const topic = `remote_member:${remoteParticipant.sid}`
    this.subscription = consumer.subscriptions.create(
      topic,
      {
        received: (data: any) => {
          if (_.includes(['connected', 'updated'], data.event)) {
            this.remoteMembership = data.payload
            if (this.onChange) {
              this.onChange(this)
            }
          } else {
            console.error(`${topic} received unknown event ${data.event}`);
          }
        }
      }
    )
  }

  unsubscribe = () => {
    this.subscription.unsubscribe()
  }

  toRemoteConnection: () => RemoteConnection = () => {
    return {
      membershipId: _.get(this.remoteMembership, 'id'),
      audioTrack: this.audioTrack,
      videoTrack: this.videoTrack,
      subscription: this.subscription
    }
  }

  get audioTrack(): Video.RemoteAudioTrack {
    return _.get(
      _.first(Array.from(this.remoteParticipant.audioTracks.values())),
      'track'
    )
  }

  get videoTrack(): Video.RemoteVideoTrack {
    return _.get(
      _.first(Array.from(this.remoteParticipant.videoTracks.values())),
      'track'
    )
  }
}
