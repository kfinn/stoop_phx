import RemoteConnectionsContext from "contexts/RemoteConnectionsContext";
import _ from "lodash";
import { useContext, useMemo } from "react";

export default function useRemoteConnection(id: string) {
  const remoteConnections = useContext(RemoteConnectionsContext)

  return useMemo(() => {
    return _.find(
      remoteConnections,
      (remoteConnection) => remoteConnection.membershipId == id
    )
  }, [id, remoteConnections])
}
