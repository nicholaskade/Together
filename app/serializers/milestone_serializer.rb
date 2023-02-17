class MilestoneSerializer < ActiveModel::Serializer
  attributes :id, :creator_id, :partner_id, :type_of, :date

  belongs_to :creator, serializer: PostUserShowSerializer
  belongs_to :partner, serializer: PostUserShowSerializer
end
