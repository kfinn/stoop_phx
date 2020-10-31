
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import activeRemoteMembershipsCountState from "state/activeRemoteMembershipsCountState";

export default function useWarnBeforeQuitting() {
    const activeRemoteMembershipsCount = useRecoilValue(activeRemoteMembershipsCountState)

    useEffect(() => {
        if (activeRemoteMembershipsCount == 0) {
            return;
        }

        const onBeforeUnload = (event: BeforeUnloadEvent) => {
            event.returnValue = 'Leaving this page will end the video call.'
            event.preventDefault()
            return event.returnValue
        }

        window.addEventListener('beforeunload', onBeforeUnload)
        return () => { window.removeEventListener('beforeunload', onBeforeUnload) }
    }, [activeRemoteMembershipsCount])
}
