class Post < ApplicationRecord
    belongs_to :user
    has_many :comments, dependent: :destroy
    has_many :likes, dependent: :destroy

    def number_of_likes
        number_of_likes = self.likes.count
        return number_of_likes
    end

    def number_of_comments
        number_of_comments = self.comments.count
        return number_of_comments
    end
end
