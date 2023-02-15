class UsersController < ApplicationController
  skip_before_action :authorized_user, only:[:create, :set_user, :dms, :significant_others, :so_opinions, :dates]
  before_action :set_user, only: [:show, :update, :destroy, :friends, :dms, :unfriend, :significant_others]

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

  def friends
    friends = @user.friends
    render json: friends
  end

  def significant_others
    friendships = @user.sent_friendships + @user.received_friendships
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
    friendships = @user.sent_friendships + @user.received_friendships
    target = []

    for friendship in friendships
      if friendship.recipient_id == @user.id && friendship.sender_id == params[:friend_id].to_i
        target << friendship
      elsif friendship.sender_id == @user.id && friendship.recipient_id == params[:friend_id].to_i
        target << friendship
      end
    end

    if target == []
      render json: { "errors": "Friendship not found." }, status: :no_content
    elsif target.length == 1
      deleted_friendship = target[0]
      deleted_friendship.destroy
      render json: User.find(params[:friend_id]), status: :ok
    else 
      render json: { "errors": "Something went wrong in our database. Please contact together.io support." }, status: 404
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
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def user_params
      params.require(:user).permit(:full_name, :email, :gender, :date_of_birth, :relationship_status, :profile_picture, :password, :password_confirmation, :username, :profile_blurb)
    end
end
