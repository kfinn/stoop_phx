import consumer, { Topic } from "channels/consumer";
import { useEffect, useRef, useState } from "react";
import _ from "lodash";

interface SubscriptionActions {
    [event: string]: (payload: any) => void
}

export interface Subscription {
    perform: (action: string, attributes: any) => void
}

export default function useSubscription(topic: Topic, actions: SubscriptionActions) {
    const actionsRef = useRef(actions)

    useEffect(() => {
        actionsRef.current = actions
    }, [actions])

    const [performQueue, setPerformQueue] = useState([])
    const subscriptionRef = useRef(null)

    const flushPerformQueue = () => {
        if (!subscriptionRef.current || _.isEmpty(performQueue)) {
            return;
        }

        _.each(performQueue, ({ action, attributes }) => {
            subscriptionRef.current.perform(action, attributes)
        })

        setPerformQueue([])
    }

    useEffect(() => {
        flushPerformQueue()
    }, [performQueue])

    useEffect(() => {
        const subscription = consumer.subscriptions.create(
            topic,
            {
                received({ event, payload }) {
                    const action = actionsRef.current[event]
                    if (action) {
                        action(payload)
                    } else {
                        console.error(`${topic} received unknown event ${event}`);
                    }
                }
            }
        )
        subscriptionRef.current = subscription

        flushPerformQueue()

        return () => subscription.unsubscribe()
    }, [JSON.stringify(topic)])

    return {
        perform: (action: string, attributes: any) => {
            setPerformQueue([...performQueue, { action, attributes }])
        }
    }
}
