defmodule StoopWeb.RoomChannel do
  use StoopWeb, :channel

  @impl true
  def join("room:" <> room_id, _payload, socket) do
    member = Stoop.Members.get_member!(socket.assigns[:member_id])
    room = Stoop.Rooms.get_room!(room_id)
    require Logger
    Logger.info(member)
    Logger.info(room)
    if member.room == room do
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  @impl true
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (room:lobby).
  @impl true
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end
end
