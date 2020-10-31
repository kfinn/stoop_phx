import { MAX_VOLUME, MIN_VOLUME } from "components/VolumeVisualizer";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import useConnectionVolumes, { AudioConnection, VolumesByMembershipId } from "./useConnectionVolumes";

export const VOLUME_RANGE = MAX_VOLUME - MIN_VOLUME
const DECAY_PER_MS = -VOLUME_RANGE/3000

interface VolumeMeasurement {
  volume: number
  measuredAtMs: number
}

const EMPTY_VOLUME_MEASUREMENT: VolumeMeasurement = {
  volume: 0,
  measuredAtMs: 0
}

interface VolumeMeasurementsByMembershipId {
  [membershipId: string]: VolumeMeasurement
}

function volumeMeasurementDecayedAsOf(
  { volume, measuredAtMs }: VolumeMeasurement,
  asOfMs: number
): number {
  const ageMs = asOfMs - measuredAtMs
  const decayAmount = _.min([ageMs * DECAY_PER_MS, 0])
  return _.clamp(volume + decayAmount, MIN_VOLUME, MAX_VOLUME)
}

export default function useConnectionRecentMaxVolumes(connections: AudioConnection[]): VolumesByMembershipId {
  const connectionVolumes = useConnectionVolumes(connections)
  const [
    connectionRecentMaxVolumeMeasurements,
    setConnectionRecentMaxVolumeMeasurements
  ] = useState<VolumeMeasurementsByMembershipId>({})

  useEffect(() => {
    const measuredAtMs = Date.now()

    const nextConnectionRecentMaxVolumes = {}
    _.each(
      connectionVolumes,
      (volume, membershipId) => {
        const previousVolumeMeasurement = _.get(
          connectionRecentMaxVolumeMeasurements,
          membershipId,
          EMPTY_VOLUME_MEASUREMENT
        )

        const decayedPreviousVolume = volumeMeasurementDecayedAsOf(previousVolumeMeasurement, measuredAtMs)

        if (decayedPreviousVolume > volume) {
          nextConnectionRecentMaxVolumes[membershipId] = previousVolumeMeasurement
        } else {
          nextConnectionRecentMaxVolumes[membershipId] = { volume, measuredAtMs }
        }
      }
    )
    setConnectionRecentMaxVolumeMeasurements(nextConnectionRecentMaxVolumes)
  }, [connectionVolumes])

  const nowMs = Date.now()
  return _.mapValues(
    connectionRecentMaxVolumeMeasurements,
    (volumeMeasurement) => volumeMeasurementDecayedAsOf(volumeMeasurement, nowMs)
  )
}
