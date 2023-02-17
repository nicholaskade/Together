class Milestone < ApplicationRecord
    belongs_to :creator, class_name: "User", foreign_key: "creator_id"
    belongs_to :partner, class_name: "User", foreign_key: "partner_id"
end
