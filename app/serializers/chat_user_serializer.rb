class ChatUserSerializer < ActiveModel::Serializer
  attributes :id, :chat_id, :user_id, :created_at
end
