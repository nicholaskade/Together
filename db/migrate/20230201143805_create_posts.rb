class CreatePosts < ActiveRecord::Migration[7.0]
  def change
    create_table :posts do |t|
      t.integer :user_id
      t.text :text
      t.string :image
      t.string :type

      t.timestamps
    end
  end
end
