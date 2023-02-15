class CreateFriendships < ActiveRecord::Migration[7.0]
  def change
    create_table :friendships do |t|
      t.integer :sender_id
      t.integer :recipient_id
      t.boolean :confirmed
      t.boolean :is_significant_other

      t.timestamps
    end
  end
end
