defmodule Stoop.Members do
  @moduledoc """
  The Members context.
  """

  import Ecto.Query, warn: false
  alias Stoop.Repo

  alias Stoop.Members.Member

  @doc """
  Returns the list of members.

  ## Examples

      iex> list_members()
      [%Member{}, ...]

  """
  def list_members do
    Repo.all(Member)
  end

  @doc """
  Gets a single member.

  Raises `Ecto.NoResultsError` if the Member does not exist.

  ## Examples

      iex> get_member!(123)
      %Member{}

      iex> get_member!(456)
      ** (Ecto.NoResultsError)

  """
  def get_member!(id), do: Repo.get!(Member, id)

  def get_member_by_twilio_participant_sid!(twilio_participant_sid) do
    Member
      |> where([members], members.twilio_participant_sid == ^twilio_participant_sid)
      |> first
      |> Repo.one!
  end

  @doc """
  Creates a member.

  ## Examples

      iex> create_member(%{field: value})
      {:ok, %Member{}}

      iex> create_member(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_member(attrs \\ %{}) do
    %Member{}
    |> Member.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a member.

  ## Examples

      iex> update_member(member, %{field: new_value})
      {:ok, %Member{}}

      iex> update_member(member, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_member(%Member{} = member, attrs, opts \\ []) do
    member_update = member
      |> Member.changeset(attrs)
      |> Repo.update()

    if  {:ok, member} = member_update do
      broadcast_to_local_member = Keyword.get(opts, :broadcast_to_local_member, true)
      if broadcast_to_local_member do
        StoopWeb.Endpoint.broadcast!(
          "local_member:" <> member.id,
          "updated",
          to_local_member_channel_attributes(member)
        )
      end
      if member.twilio_participant_sid do
        StoopWeb.Endpoint.broadcast!(
          "remote_member:" <> member.twilio_participant_sid,
          "updated",
          to_remote_member_channel_attributes(member)
        )
      end
    end

    member_update
  end

  @doc """
  Deletes a member.

  ## Examples

      iex> delete_member(member)
      {:ok, %Member{}}

      iex> delete_member(member)
      {:error, %Ecto.Changeset{}}

  """
  def delete_member(%Member{} = member) do
    Repo.delete(member)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking member changes.

  ## Examples

      iex> change_member(member)
      %Ecto.Changeset{data: %Member{}}

  """
  def change_member(%Member{} = member, attrs \\ %{}) do
    Member.changeset(member, attrs)
  end

  def to_local_member_channel_attributes(%Member{} = member) do
    %{
      name: member.name,
      muted: member.muted,
      video_muted: member.video_muted,
      shouting: member.shouting,
      group_id: member.group_id,
      invitation_membership_id: member.invitation_member_id
    }
  end

  def to_remote_member_channel_attributes(%Member{} = member) do
    Map.merge(
      to_local_member_channel_attributes(member),
      %{
        id: member.id,
        twilio_participant_sid: member.twilio_participant_sid,
        active: true
      }
    )
  end
end
