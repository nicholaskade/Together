class Outing < ApplicationRecord
    has_many :outing_participants, foreign_key: :outing_id
    has_many :users, through: :outing_participants, foreign_key: :user_id

    def user_ids
        user_ids = []
        
        for user in self.users
            user_ids << user.id
        end
    
        user_ids
    end
end
