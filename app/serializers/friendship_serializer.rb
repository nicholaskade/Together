class FriendshipSerializer < ActiveModel::Serializer
  attributes :id, :sender_id, :recipient_id, :confirmed, :is_significant_other
end
