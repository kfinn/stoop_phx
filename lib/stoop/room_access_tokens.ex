defmodule Stoop.RoomAccessTokens do
  def create_room_access_token(%{ member_id: member_id, twilio_room_sid: twilio_room_sid}) do
    ExTwilio.JWT.AccessToken.new(%{
      account_sid: Application.get_env(:ex_twilio, :account_sid),
      api_key: Application.get_env(:ex_twilio, :api_key),
      api_secret: Application.get_env(:ex_twilio, :api_secret),
      identity: member_id,
      grants: [
        ExTwilio.JWT.AccessToken.VideoGrant.new(%{ room: twilio_room_sid })
      ],
      expires_in: (24 * 60 * 60)
    })
  end

  def to_jwt(%ExTwilio.JWT.AccessToken{} = token) do
    ExTwilio.JWT.AccessToken.to_jwt! token
  end
end
