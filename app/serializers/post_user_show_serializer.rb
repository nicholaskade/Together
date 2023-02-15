class PostUserShowSerializer < ActiveModel::Serializer
    attributes :id, :full_name, :profile_picture, :username
  end
  