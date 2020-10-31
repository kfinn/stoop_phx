defmodule Stoop.MembersTest do
  use Stoop.DataCase

  alias Stoop.Members

  describe "members" do
    alias Stoop.Members.Member

    @valid_attrs %{muted: true, name: "some name", shouting: true, twilio_participant_sid: "some twilio_participant_sid", video_muted: true}
    @update_attrs %{muted: false, name: "some updated name", shouting: false, twilio_participant_sid: "some updated twilio_participant_sid", video_muted: false}
    @invalid_attrs %{muted: nil, name: nil, shouting: nil, twilio_participant_sid: nil, video_muted: nil}

    def member_fixture(attrs \\ %{}) do
      {:ok, member} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Members.create_member()

      member
    end

    test "list_members/0 returns all members" do
      member = member_fixture()
      assert Members.list_members() == [member]
    end

    test "get_member!/1 returns the member with given id" do
      member = member_fixture()
      assert Members.get_member!(member.id) == member
    end

    test "create_member/1 with valid data creates a member" do
      assert {:ok, %Member{} = member} = Members.create_member(@valid_attrs)
      assert member.muted == true
      assert member.name == "some name"
      assert member.shouting == true
      assert member.twilio_participant_sid == "some twilio_participant_sid"
      assert member.video_muted == true
    end

    test "create_member/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Members.create_member(@invalid_attrs)
    end

    test "update_member/2 with valid data updates the member" do
      member = member_fixture()
      assert {:ok, %Member{} = member} = Members.update_member(member, @update_attrs)
      assert member.muted == false
      assert member.name == "some updated name"
      assert member.shouting == false
      assert member.twilio_participant_sid == "some updated twilio_participant_sid"
      assert member.video_muted == false
    end

    test "update_member/2 with invalid data returns error changeset" do
      member = member_fixture()
      assert {:error, %Ecto.Changeset{}} = Members.update_member(member, @invalid_attrs)
      assert member == Members.get_member!(member.id)
    end

    test "delete_member/1 deletes the member" do
      member = member_fixture()
      assert {:ok, %Member{}} = Members.delete_member(member)
      assert_raise Ecto.NoResultsError, fn -> Members.get_member!(member.id) end
    end

    test "change_member/1 returns a member changeset" do
      member = member_fixture()
      assert %Ecto.Changeset{} = Members.change_member(member)
    end
  end
end
