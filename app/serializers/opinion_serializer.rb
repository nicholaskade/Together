class OpinionSerializer < ActiveModel::Serializer
  attributes :id, :thing, :user_id, :owner_id, :liked
end
