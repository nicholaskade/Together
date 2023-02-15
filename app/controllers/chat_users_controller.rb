class ChatUsersController < ApplicationController
  before_action :set_chat_user, only: %i[ show update destroy ]

  # GET /chat_users
  def index
    @chat_users = ChatUser.all

    render json: @chat_users
  end

  # GET /chat_users/1
  def show
    render json: @chat_user
  end

  # POST /chat_users
  def create
    @chat_user = ChatUser.new(chat_user_params)

    if @chat_user.save
      render json: @chat_user, status: :created, location: @chat_user
    else
      render json: @chat_user.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /chat_users/1
  def update
    if @chat_user.update(chat_user_params)
      render json: @chat_user
    else
      render json: @chat_user.errors, status: :unprocessable_entity
    end
  end

  # DELETE /chat_users/1
  def destroy
    @chat_user.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_chat_user
      @chat_user = ChatUser.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def chat_user_params
      params.require(:chat_user).permit(:chat_id, :user_id)
    end
end
