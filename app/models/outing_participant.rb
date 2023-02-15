class OutingParticipant < ApplicationRecord
    belongs_to :user
    belongs_to :outing
end
