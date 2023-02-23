class MessagesChannel < ApplicationCable::Channel
  def subscribed
    stream_from "/chat/#{params[:chat_id]}"
  end

  def unsubscribe
    stop_all_streams
  end
end
