class ChatSerializer < ActiveModel::Serializer
  attributes :id, :name, :created_at, :messages
  
  def messages
    object.messages.order(created_at: :asc)
  end
end
