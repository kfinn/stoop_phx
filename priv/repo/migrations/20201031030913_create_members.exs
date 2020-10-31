defmodule Stoop.Repo.Migrations.CreateMembers do
  use Ecto.Migration

  def change do
    create table(:members, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :session_id, :binary_id, null: false
      add :name, :string
      add :muted, :boolean, default: false, null: false
      add :video_muted, :boolean, default: false, null: false
      add :twilio_participant_sid, :string
      add :shouting, :boolean, default: false, null: false
      add :room_id, references(:rooms, on_delete: :nothing, type: :binary_id)
      add :group_id, references(:groups, on_delete: :nothing, type: :binary_id)
      add :invitation_member_id, references(:members, on_delete: :nothing, type: :binary_id)

      timestamps()
    end

    create unique_index(:members, [:twilio_participant_sid])
    create index(:members, [:room_id])
    create index(:members, [:group_id])
    create index(:members, [:invitation_member_id])
    create index(:members, [:session_id])
  end
end
