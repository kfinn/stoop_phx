defmodule Stoop.Rooms do
  @moduledoc """
  The Rooms context.
  """

  import Ecto.Query, warn: false
  alias Stoop.Repo

  alias Stoop.Rooms.Room

  @doc """
  Returns the list of rooms.

  ## Examples

      iex> list_rooms()
      [%Room{}, ...]

  """
  def list_rooms do
    Repo.all(Room)
  end

  @doc """
  Gets a single room.

  Raises `Ecto.NoResultsError` if the Room does not exist.

  ## Examples

      iex> get_room!(123)
      %Room{}

      iex> get_room!(456)
      ** (Ecto.NoResultsError)

  """
  def get_room!(id), do: Repo.get!(Room, id)

  @doc """
  Creates a room.

  ## Examples

      iex> create_room(%{field: value})
      {:ok, %Room{}}

      iex> create_room(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_room(attrs \\ %{}) do
    %Room{}
    |> Room.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a room.

  ## Examples

      iex> update_room(room, %{field: new_value})
      {:ok, %Room{}}

      iex> update_room(room, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_room(%Room{} = room, attrs) do
    room_update = room
    |> Room.changeset(attrs)
    |> Repo.update()

    if {:ok, room} = room_update do
      StoopWeb.Endpoint.broadcast!(
        "room:" <> room.id,
        "updated",
        %{ twilio_room_sid: room.twilio_room_sid }
      )
    end

    room_update
  end

  @doc """
  Deletes a room.

  ## Examples

      iex> delete_room(room)
      {:ok, %Room{}}

      iex> delete_room(room)
      {:error, %Ecto.Changeset{}}

  """
  def delete_room(%Room{} = room) do
    Repo.delete(room)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking room changes.

  ## Examples

      iex> change_room(room)
      %Ecto.Changeset{data: %Room{}}

  """
  def change_room(%Room{} = room, attrs \\ %{}) do
    Room.changeset(room, attrs)
  end

  def ensure_twilio_room_exists!(%Room{} = room) do
    locked_room = Room |> where(id: ^room.id) |> lock("FOR UPDATE") |> Repo.one

    twilio_room_sid = case ExTwilio.Video.Room.find(locked_room.twilio_room_sid) do
      {:ok, %ExTwilio.Video.Room{status: "in-progress"}} ->
        locked_room.twilio_room_sid

      _ ->
        case ExTwilio.Video.Room.create(%{}) do
          {:ok, %ExTwilio.Video.Room{sid: sid}} ->
            sid

          _ -> nil
        end
    end

    if twilio_room_sid do
      update_room(locked_room, %{twilio_room_sid: twilio_room_sid})
    else
      {:error, "could not update twilio_room_sid"}
    end
  end
end
