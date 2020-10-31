import { useCallback, useEffect } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import isUserMediaAvailableState from "./isUserMediaAvailableState";

const availableMediaDevicesState = atom<MediaDeviceInfo[]>({
    key: 'availableMediaDevicesState',
    default: navigator.mediaDevices.enumerateDevices()
})
export default availableMediaDevicesState

export function useSyncAvailableMediaDevices() {
    const setAvailableMediaDevices = useSetRecoilState(availableMediaDevicesState)
    const isUserMediaAvailable = useRecoilValue(isUserMediaAvailableState)

    const onDeviceChange = useCallback(async () => {
        const devices = await navigator.mediaDevices.enumerateDevices()
        setAvailableMediaDevices(devices)
    }, [])

    useEffect(() => {
        navigator.mediaDevices.addEventListener('devicechange', onDeviceChange)
        onDeviceChange()
        return () => navigator.mediaDevices.removeEventListener('devicechange', onDeviceChange)
    }, [])

    useEffect(() => {
        onDeviceChange()
    }, [isUserMediaAvailable])
}
