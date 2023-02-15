class Chat < ApplicationRecord
    has_many :chat_users
    has_many :users, through: :chat_users, foreign_key: :chat_id
    has_many :messages

    def user_ids
        user_ids = []
        
        for user in self.users
            user_ids << user.id
        end
    
        user_ids
    end
end
