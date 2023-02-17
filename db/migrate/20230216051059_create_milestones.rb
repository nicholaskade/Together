class CreateMilestones < ActiveRecord::Migration[7.0]
  def change
    create_table :milestones do |t|
      t.integer :creator_id
      t.integer :partner_id
      t.string :type
      t.date :date

      t.timestamps
    end
  end
end
