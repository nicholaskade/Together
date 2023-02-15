class PostSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :text, :image, :type_of, :created_at, :updated_at

  belongs_to :user, serializer: PostUserShowSerializer
end
