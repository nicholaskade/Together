class MessageSerializer < ActiveModel::Serializer
  attributes :id, :sender_id, :chat_id, :body, :created_at, :updated_at
end
