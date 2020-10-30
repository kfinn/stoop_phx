defmodule StoopWeb.PageController do
  use StoopWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
