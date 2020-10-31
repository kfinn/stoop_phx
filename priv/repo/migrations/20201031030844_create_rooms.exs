defmodule Stoop.Repo.Migrations.CreateRooms do
  use Ecto.Migration

  def change do
    create table(:rooms, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :twilio_room_sid, :string

      timestamps()
    end

  end
end
