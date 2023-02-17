class UpdateColumnTypeOnMilestones < ActiveRecord::Migration[7.0]
  def change
    rename_column :milestones, :type, :type_of
  end
end
