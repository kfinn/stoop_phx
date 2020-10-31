defmodule Stoop.Groups.Group do
  use Ecto.Schema
  import Ecto.Changeset

  alias Stoop.Members.Member
  alias Stoop.Rooms.Room

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "groups" do
    # field :room_id, :binary_id

    belongs_to :room, Room
    has_many :members, Member

    timestamps()
  end

  @doc false
  def changeset(group, attrs) do
    group
    |> cast(attrs, [])
    |> validate_required([])
  end
end
