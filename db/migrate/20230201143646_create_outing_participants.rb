class CreateOutingParticipants < ActiveRecord::Migration[7.0]
  def change
    create_table :outing_participants do |t|
      t.integer :outing_id
      t.integer :user_id

      t.timestamps
    end
  end
end
