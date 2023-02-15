class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :full_name
      t.string :email
      t.string :gender
      t.date :date_of_birth
      t.string :relationship_status
      t.boolean :is_admin

      t.timestamps
    end
  end
end
