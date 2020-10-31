# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :stoop,
  ecto_repos: [Stoop.Repo],
  generators: [binary_id: true],
  migration_primary_key: [type: :binary_id]

# Configures the endpoint
config :stoop, StoopWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "xhY7vOqITPmYMIk/gi3TolGuJWxZ80UQFSIsUobG4e8kJsgjjnOFJSe+/Abv3oGN",
  render_errors: [view: StoopWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: Stoop.PubSub,
  live_view: [signing_salt: "7gCO38qF"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
