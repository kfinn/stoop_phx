import React from "react";
import { useRecoilValue } from "recoil";
import membershipTransformState from "state/membershipTransformState";

export const VIDEO_CELL_UNIT_SIZE = 480
export const VIDEO_ASPECT_RATIO = (16 / 9)

export default function VideoCell({ membershipId, children }: { membershipId: string, children: any }) {
    const transform = useRecoilValue(membershipTransformState(membershipId))

    return <div
        className="grid-cell"
        style={{ width: `${VIDEO_ASPECT_RATIO * VIDEO_CELL_UNIT_SIZE}px`, height: `${VIDEO_CELL_UNIT_SIZE}px`, transform }}
    >
        {children}
    </div>
}
