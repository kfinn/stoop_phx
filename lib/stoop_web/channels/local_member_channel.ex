defmodule StoopWeb.LocalMemberChannel do
  use StoopWeb, :channel

    alias Phoenix.Socket.Broadcast

  @impl true
  def join("local_member", _payload, socket) do
    member = Stoop.Members.get_member!(socket.assigns[:member_id])
    :ok = StoopWeb.Endpoint.subscribe("local_member:" <> member.id)
    send(self(), :after_join)
    {:ok, socket}
  end

  @impl true
  def handle_info(:after_join, socket) do
    member = Stoop.Members.get_member!(socket.assigns[:member_id])

    push(
      socket,
      "connected",
      Stoop.Members.to_local_member_channel_attributes(member)
    )

    {:noreply, socket}
  end

  @impl true
  def handle_info(%Broadcast{topic: _, event: event, payload: payload}, socket) do
    push(socket, event, payload)
    {:noreply, socket}
  end

  @impl true
  def handle_in("update", %{"local_member" => local_member_params}, socket) do
    member = Stoop.Members.get_member!(socket.assigns[:member_id])
    Stoop.Members.update_member(
      member,
      local_member_params,
      broadcast_to_local_member: false
    )

    {:noreply, socket}
  end
end
