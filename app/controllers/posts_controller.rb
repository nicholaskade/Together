class PostsController < ApplicationController
  before_action :set_post, only: %i[ show update destroy comments ]
  skip_before_action :authorized_user, only: %i[ index comments ]

  def user_posts
    user = User.find(params[:id])
    user_posts = user.posts.order(created_at: :desc)
    render json: user_posts
  end

  def comments
    post = @post
    comments = post.comments

    render json: comments
  end

  # GET /posts
  def index
    @posts = Post.all.order(created_at: :desc)
    render json: @posts, status: :ok
  end

  # GET /posts/1
  def show
    render json: @post
  end

  # POST /posts
  def create
    @post = Post.new(post_params)

    if @post.save
      render json: @post, status: :created, location: @post
    else
      render json: @post.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /posts/1
  def update
    if @post.update(post_params)
      render json: @post
    else
      render json: @post.errors, status: :unprocessable_entity
    end
  end

  # DELETE /posts/1
  def destroy
    @post.destroy
    render json: @post, status: :ok
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_post
      @post = Post.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def post_params
      params.require(:post).permit(:user_id, :text, :image, :type_of)
    end
end
