defmodule StoopWeb.RoomChannel do
  use StoopWeb, :channel

  alias Stoop.Members
  alias Phoenix.Socket.Broadcast

  @impl true
  def join("room", _payload, socket) do
    member = Members.get_member!(socket.assigns[:member_id])
    :ok = StoopWeb.Endpoint.subscribe("room:" <> member.room_id)

    send(self(), :after_join)
    {:ok, socket}
  end

  @impl true
  def handle_info(:after_join, socket) do
    member = Members.get_member!(socket.assigns[:member_id])
    room = Stoop.Rooms.get_room!(member.room_id)
    Stoop.Rooms.ensure_twilio_room_exists!(room)
    {:noreply, socket}
  end

  @impl true
  def handle_info(%Broadcast{topic: _, event: "updated", payload: payload}, socket) do
    room_access_token = Stoop.RoomAccessTokens.create_room_access_token(%{
      member_id: socket.assigns[:member_id],
      twilio_room_sid: payload[:twilio_room_sid]
    })
    room_access_token_jwt = Stoop.RoomAccessTokens.to_jwt(room_access_token)

    push(
      socket,
      "updated",
      Map.merge(
        payload,
        %{
          room_access_token: room_access_token_jwt
        }
      )
    )
    {:noreply, socket}
  end

  @impl true
  def handle_info(%Broadcast{topic: _, event: event, payload: payload}, socket) do
    push(socket, event, payload)
    {:noreply, socket}
  end
end
