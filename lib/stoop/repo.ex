defmodule Stoop.Repo do
  use Ecto.Repo,
    otp_app: :stoop,
    adapter: Ecto.Adapters.Postgres
end
