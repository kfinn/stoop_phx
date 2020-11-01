defmodule StoopWeb.RemoteMemberChannel do
  use StoopWeb, :channel

  alias Stoop.Members

  @impl true
  def join("remote_member:" <> remote_member_twilio_participant_sid, payload, socket) do
    local_member = Members.get_member!(socket.assigns[:member_id])
    remote_member = Members.get_member_by_twilio_participant_sid!(remote_member_twilio_participant_sid)

    if local_member.room_id == remote_member.room_id do
      send(self(), :after_join)
      {
        :ok,
        assign(
          socket,
          :remote_member_twilio_participant_sid,
          remote_member_twilio_participant_sid
        )
      }
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  @impl true
  def handle_info(:after_join, socket) do
    remote_member = Stoop.Members.get_member_by_twilio_participant_sid!(socket.assigns[:remote_member_twilio_participant_sid])

    push(
      socket,
      "connected",
      Stoop.Members.to_remote_member_channel_attributes(remote_member)
    )

    {:noreply, socket}
  end
end
