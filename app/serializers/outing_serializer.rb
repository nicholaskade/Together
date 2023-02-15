class OutingSerializer < ActiveModel::Serializer
  attributes :id, :name, :location, :date, :notes, :rating
end
