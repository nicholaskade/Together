class UserSerializer < ActiveModel::Serializer
  attributes :id, :full_name, :email, :gender, :date_of_birth, :relationship_status, :is_admin, :created_at, :profile_picture, :username, :profile_blurb, :significant_others
end
