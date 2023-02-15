class UpdateTypeToTypeOfOnUsers < ActiveRecord::Migration[7.0]
  def change
    rename_column :posts, :type, :type_of
  end
end
