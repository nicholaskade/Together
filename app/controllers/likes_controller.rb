class LikesController < ApplicationController

  def user_likes
    user = User.find(params[:id])
    likes = user.likes
    liked_post_ids = []

    for like in likes
      liked_post_ids << like.post_id
    end
    
    render json: liked_post_ids, status: :ok
  end

  # GET /likes
  def index
    @likes = Like.all

    render json: @likes
  end

  # GET /likes/1
  def show
    render json: @like
  end

  # POST /likes
  def create
    @like = Like.new(like_params)

    if @like.save
      render json: @like, status: :created, location: @like
    else
      render json: @like.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /likes/1
  def update
    if @like.update(like_params)
      render json: @like
    else
      render json: @like.errors, status: :unprocessable_entity
    end
  end

  # DELETE /likes/1
  def destroy
    like = Like.where(user_id: params[:id], post_id: params[:post_id])
    like[0].destroy
    render json: like, status: :ok
  end

  private

    # Only allow a list of trusted parameters through.
    def like_params
      params.require(:like).permit(:user_id, :post_id)
    end
end
