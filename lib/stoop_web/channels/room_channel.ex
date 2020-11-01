defmodule StoopWeb.RoomChannel do
  use StoopWeb, :channel
  require Logger

  @impl true
  def join("room:" <> room_id, _payload, socket) do
    member = Stoop.Members.get_member!(socket.assigns[:member_id])
    room = Stoop.Rooms.get_room!(room_id)

    if member.room_id == room.id do
      send(self(), :after_join)
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  @impl true
  def handle_info(:after_join, socket) do
    member = Stoop.Members.get_member!(socket.assigns[:member_id])
    room = Stoop.Rooms.get_room!(member.room_id)
    Stoop.Rooms.ensure_twilio_room_exists!(room)
    {:noreply, socket}
  end

  intercept ["updated"]

  @impl true
  def handle_out("updated", msg, socket) do
    room_access_token = Stoop.RoomAccessTokens.create_room_access_token(%{
      member_id: socket.assigns[:member_id],
      twilio_room_sid: msg[:twilio_room_sid]
    })
    room_access_token_jwt = Stoop.RoomAccessTokens.to_jwt(room_access_token)

    push(
      socket,
      "updated",
      %{
        twilio_room_sid: msg[:twilio_room_sid],
        room_access_token: room_access_token_jwt
      }
    )
    {:noreply, socket}
  end
end
