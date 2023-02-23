class UsersController < ApplicationController
  skip_before_action :authorized_user, only:[:create, :set_user, :dms, :significant_others, :so_opinions, :dates, :friends, :friends_with_chats]
  before_action :set_user, only: [:show, :update, :destroy, :friends, :dms, :unfriend, :significant_others, :make_so, :friends_with_chats]

  def dates
    dates = User.find(params[:id]).outings
    target = []

    for date in dates 
      if date.user_ids.sort == [(params[:id].to_i), (params[:friend_id].to_i)].sort
        target << date
      end
    end

    render json: target, status: :ok
  end
  
  def dms
    chats = User.find(params[:id]).chats
    target = []
    served = []
    # debugger
    for chat in chats
      if chat.user_ids.sort == [(params[:id].to_i), (params[:friend_id].to_i)].sort
        target << chat
      end
    end

    if target.empty?
      chat = Chat.create(name: nil)
      ChatUser.create(user_id: params[:id], chat_id: chat.id)
      ChatUser.create(user_id: params[:friend_id], chat_id: chat.id)
      served = chat
    else
      served = target[0]
    end

    render json: served 
  end

  def friends_with_chats
    friends = @user.friends
    friends_with_chats = []


    for friend in friends
      chats = friend.chats
      chat_with_friend = []

      for chat in chats
        if chat.user_ids.sort == [(params[:id].to_i), friend.id.to_i].sort
          chat_with_friend << chat
        end
      end

      if chat_with_friend.empty?
        chat = Chat.create(name: nil)
        ChatUser.create(user_id: params[:id], chat_id: chat.id)
        ChatUser.create(user_id: friend.id, chat_id: chat.id)
        chat_with_friend << chat
      end

      friends_with_chats << { friend: friend, chat: chat_with_friend[0] }
    end
    
    render json: friends_with_chats, status: :ok
  end

  def friends
    friends = @user.friends
    render json: friends, status: :ok
  end

  def make_so 
    friendships = @user.sent_friendships + @user.received_friendships
    target = []

    target_friendship = find_friendship(friendships)

    if target_friendship == []
      render json: { "errors": "Friendship not found." }, status: :no_content
    elsif target.length == 1
      friendship_to_update = target_friendship[0]
      friendship_to_update.update(is_significant_other: true)
      render json: User.find(params[:friend_id]), status: :ok
    else 
      render json: { "errors": "Something went wrong in our database. Please contact together.io support." }, status: 404
    end
  end

  def significant_others
    friendships = @user.friendships
    target = []

    for friendship in friendships
      if friendship.is_significant_other == true and friendship.confirmed == true
        if friendship.sender_id == @user.id
          target << friendship.recipient
        elsif friendship.recipient_id == @user.id
          target << friendship.sender
        end
      end
    end
    render json: target, status: :ok
  end

  def so_opinions
    opinions = User.find(params[:id]).opinions_created
    target = []

    for opinion in opinions
      if opinion.owner_id == params[:friend_id].to_i && opinion.user_id == params[:id].to_i
        target << opinion
      end
    end

    render json: target, status: :ok
  end

  def unfriend 
    friendships = @user.friendships
    target_friendship = find_friendship(friendships)

    if target_friendship == []
      render json: { "errors": "Friendship not found." }, status: :not_found
    elsif target_friendship.length == 1
      friendship_to_delete = target_friendship[0]
      friendship_to_delete.destroy
      render json: User.find(params[:friend_id]), status: :ok
    else 
      render json: { "errors": "Something went wrong in our database. Please contact together.io support." }, status: 500
    end
  end

  def unmake_so
    friendships = @user.friendships
    target_friendship = find_friendship(friendships)

    if target_friendship == []
      render json: { "errors": "Friendship not found." }, status: :not_found
    elsif target_friendship.length == 1
      just_friends = target_friendship[0]
      just_friends.update(is_significant_other: false)
      render json: User.find(params[:friend_id]), status: :ok
    else
      render json: { "errors": "Something went wrong in our database. Please contact together.io support." }, status: 500
    end
  end

  # GET /users
  def index
    @users = User.all

    render json: @users
  end

  # GET /users/1
  def show
    render json: @user
  end

  # POST /users
  def create
    @user = User.create!(user_params)

    if @user.save
      session[:user_id] = @user.id
      render json: @user, status: :created, location: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /users/1
  def update
    if @user.update(user_params)
      render json: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # DELETE /users/1
  def destroy
    @user.destroy
    render json: @user, status: :ok
  end

  private
    def find_friendship(friendships)
      target = []

      for friendship in friendships
        if friendship.recipient_id == @user.id && friendship.sender_id == params[:friend_id].to_i
          target << friendship
        elsif friendship.sender_id == @user.id && friendship.recipient_id == params[:friend_id].to_i
          target << friendship
        end
      end
      target
    end
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      # debugger
      if params[:id] != "null"
        @user = User.find(params[:id])
      end
    end

    # Only allow a list of trusted parameters through.
    def user_params
      params.require(:user).permit(:full_name, :email, :gender, :date_of_birth, :relationship_status, :profile_picture, :password, :password_confirmation, :username, :profile_blurb)
    end
end
