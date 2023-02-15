class User < ApplicationRecord
    has_secure_password

    has_many :posts
    has_many :chat_users 
    has_many :chats, through: :chat_users, foreign_key: :user_id
    has_many :comments
    has_many :likes
    has_many :outing_participants
    has_many :outings, through: :outing_participants
    has_many :opinions
    has_many :messages, foreign_key: "sender_id"
    has_many :received_friendships, class_name: "Friendship", foreign_key: "recipient_id"
    has_many :sent_friendships, class_name: "Friendship", foreign_key: "sender_id"
    has_many :opinions, class_name: "Opinion", foreign_key: "owner_id"
    has_many :opinions_created, class_name: "Opinion", foreign_key: "user_id"
    
    validates :password, presence: true, length: { minimum: 8, maximum: 18 }
    validates :email, presence: true, uniqueness: { case_sensitive: false }
    validates :full_name, presence: true
    validates :date_of_birth, presence: true
    validate :validate_age
    validates :relationship_status, presence: true
    validates :username, presence: true, uniqueness: { case_sensitive: false }

    def validate_age
        if date_of_birth.present? && date_of_birth > 18.years.ago
            errors.add(:date_of_birth, "You must be over the age of 18 to register for a together.io account.")
        end
    end

    def friends
        friendships = self.sent_friendships + self.received_friendships
        friends = [];
        
        for friendship in friendships do 
            if friendship.sender_id != self.id && friendship.confirmed == true
                friends << friendship.sender_id
            end

            if friendship.recipient_id != self.id && friendship.confirmed == true 
                friends << friendship.recipient_id
            end
        end
        
        served = User.where(id: friends)
        served
    end

    def significant_others
        friendships = self.sent_friendships + self.received_friendships
        significant_others = []

        for friendship in friendships do 
            if friendship.sender_id != self.id && friendship.is_significant_other == true && friendship.confirmed == true 
                significant_others << (friendship.sender_id)
            end

            if friendship.recipient_id != self.id && friendship.is_significant_other == true && friendship.confirmed == true
                significant_others << (friendship.recipient_id)
            end
        end

        significant_others
    end
end
