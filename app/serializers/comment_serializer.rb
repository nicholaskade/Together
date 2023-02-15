class CommentSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :post_id, :text, :created_at, :user

  belongs_to :user, serializer: PostUserShowSerializer
end
