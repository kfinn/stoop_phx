defmodule StoopWeb.MemberSocket do
  use Phoenix.Socket

  ## Channels
  channel "room:*", StoopWeb.RoomChannel

  @impl true
  def connect(%{ "membership_token" => membership_token }, socket, _connect_info) do
    case Phoenix.Token.verify(socket, "member socket", membership_token) do
      {:ok, member_id} ->
        {:ok, assign(socket, :member_id, member_id)}
      {:error, reason} ->
        :error
    end
  end

  @impl true
  def id(socket), do: "memer:socket:#{socket.assigns[:member_id]}"
end
