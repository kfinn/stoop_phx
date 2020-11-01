import { Socket } from "phoenix";
import camelize from "camelize";
import snakeize from "snakeize";

let socket: Socket

export function configureSocket(membershipToken: string) {
    socket = new Socket('/socket', { params: snakeize({ membershipToken }) })
    socket.connect()
}

interface Mixin {
    connected?: () => void
    disconnected?: () => void
    received: (data: any) => void
}

export default {
    subscriptions: {
        create: (topic: string, mixin: Mixin) => {
            if (!socket) {
                throw "socket not configured"
            }
            const channel = socket.channel(topic)
            channel
                .join()
                .receive('ok', () => {
                    if (mixin.connected) {
                        mixin.connected()
                    }
                })
                .receive('error', () => {
                    if (mixin.disconnected) {
                        mixin.disconnected()
                    }
                })
            channel.onError = () => {
                if (mixin.disconnected) {
                    mixin.disconnected()
                }
            }
            channel.onMessage = (event, payload) => {
                const camelizedPayload = camelize({ event, payload })
                mixin.received(camelizedPayload)
                return payload
            }

            return {
                perform: (action: string, attributes: any) => {
                    const snakeizedAttributes = snakeize(attributes)
                    channel.push(action, snakeizedAttributes)
                },
                unsubscribe: () => {
                    channel.leave()
                }
            }
        }
    }
}
