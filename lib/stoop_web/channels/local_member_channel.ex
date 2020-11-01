defmodule StoopWeb.LocalMemberChannel do
  use StoopWeb, :channel

  @impl true
  def join("local_member:" <> member_id, _payload, socket) do
    authenticated_member = Stoop.Members.get_member!(socket.assigns[:member_id])
    local_member = Stoop.Members.get_member!(member_id)

    if local_member == authenticated_member do
      send(self(), :after_join)
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
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
  def handle_in("update", %{"local_member" => local_member_params}, socket) do
    member = Stoop.Members.get_member!(socket.assigns[:member_id])
    Stoop.Members.update_member(member, local_member_params)

    {:noreply, socket}
  end
end
