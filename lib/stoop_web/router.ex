defmodule StoopWeb.Router do
  use StoopWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug :ensure_session_id_exists

    def ensure_session_id_exists(conn, _opts) do
      if get_session(conn, :session_id) do
        conn
      else
        put_session(conn, :session_id, Ecto.UUID.generate)
      end
    end
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", StoopWeb do
    pipe_through :browser

    get "/", RoomController, :index
    resources "/rooms", RoomController, only: [:index, :create, :show]
  end

  # Other scopes may use custom stacks.
  # scope "/api", StoopWeb do
  #   pipe_through :api
  # end

  # Enables LiveDashboard only for development
  #
  # If you want to use the LiveDashboard in production, you should put
  # it behind authentication and allow only admins to access it.
  # If your application does not have an admins-only section yet,
  # you can use Plug.BasicAuth to set up some basic authentication
  # as long as you are also using SSL (which you should anyway).
  if Mix.env() in [:dev, :test] do
    import Phoenix.LiveDashboard.Router

    scope "/" do
      pipe_through :browser
      live_dashboard "/dashboard", metrics: StoopWeb.Telemetry
    end
  end
end
