defmodule Stoop.Members.Member do
  use Ecto.Schema
  import Ecto.Changeset

  alias Stoop.Groups.Group
  alias Stoop.Members.Member
  alias Stoop.Rooms.Room

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "members" do
    belongs_to :room, Room
    belongs_to :group, Group
    belongs_to :invitation_member, Member

    field :session_id, :binary_id
    field :muted, :boolean, default: false
    field :name, :string
    field :shouting, :boolean, default: false
    field :twilio_participant_sid, :string
    field :video_muted, :boolean, default: false

    timestamps()
  end

  @doc false
  def changeset(member, attrs) do
    member
    |> cast(attrs, [:session_id, :name, :muted, :video_muted, :twilio_participant_sid, :shouting, :room_id, :group_id, :invitation_member_id])
    |> validate_required([:session_id, :muted, :video_muted, :shouting, :room_id])
    |> unique_constraint(:twilio_participant_sid)
  end
end
