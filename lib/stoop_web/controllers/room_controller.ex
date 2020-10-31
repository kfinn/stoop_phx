defmodule StoopWeb.RoomController do
  use StoopWeb, :controller

  alias Stoop.Rooms
  alias Stoop.Rooms.Room
  alias Stoop.Members

  def index(conn, _params) do
    changeset = Rooms.change_room(%Room{})
    render(conn, "index.html", changeset: changeset)
  end

  def create(conn, _params) do
    case Rooms.create_room() do
      {:ok, room} ->
        conn
        |> put_flash(:info, "Room created successfully.")
        |> redirect(to: Routes.room_path(conn, :show, room))

      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_flash(:error, "Could not create room.")
        |> render("index.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    room = Rooms.get_room!(id)
    session_id = get_session(conn, :session_id)
    case Members.create_member(%{room_id: room.id, session_id: session_id}) do
      {:ok, member} ->
        render(conn, "show.html", room: room, member: member)

      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_flash(:error, "Could not join room.")
        |> redirect(to: Routes.room_path(conn, :index))
    end
  end
end
