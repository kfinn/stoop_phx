defmodule Stoop.Rooms.Room do
  use Ecto.Schema
  import Ecto.Changeset

  alias Stoop.Groups.Group
  alias Stoop.Members.Member

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "rooms" do
    field :twilio_room_sid, :string

    has_many :groups, Group
    has_many :members, Member

    timestamps()
  end

  @doc false
  def changeset(room, attrs) do
    room
    |> cast(attrs, [:twilio_room_sid])
  end
end
