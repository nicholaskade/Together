class AddProfileBlurbToUser < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :profile_blurb, :string
  end
end
