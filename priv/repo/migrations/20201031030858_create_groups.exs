defmodule Stoop.Repo.Migrations.CreateGroups do
  use Ecto.Migration

  def change do
    create table(:groups, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :room_id, references(:rooms, on_delete: :nothing, type: :binary_id)

      timestamps()
    end

    create index(:groups, [:room_id])
  end
end
