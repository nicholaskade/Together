class CreateOpinions < ActiveRecord::Migration[7.0]
  def change
    create_table :opinions do |t|
      t.string :thing
      t.integer :user_id
      t.integer :owner_id
      t.boolean :liked

      t.timestamps
    end
  end
end
