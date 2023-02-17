class MilestonesController < ApplicationController
  before_action :set_milestone, only: %i[ show update destroy ]
  skip_before_action :authorized_user, only: %i[ create user_milestones ]


  def user_milestones 
    milestones = Milestone.where(partner_id: params[:id]) + Milestone.where(creator_id: params[:id])
    render json: milestones.sort_by{|m| m[:date]}.reverse!, status: :ok
  end
  # GET /milestones
  def index
    @milestones = Milestone.all

    render json: @milestones
  end

  # GET /milestones/1
  def show
    render json: @milestone
  end

  # POST /milestones
  def create
    @milestone = Milestone.new(milestone_params)

    if @milestone.save
      render json: @milestone, status: :created, location: @milestone
    else
      render json: @milestone.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /milestones/1
  def update
    if @milestone.update(milestone_params)
      render json: @milestone
    else
      render json: @milestone.errors, status: :unprocessable_entity
    end
  end

  # DELETE /milestones/1
  def destroy
    @milestone.destroy
    render json: @milestone, status: :ok
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_milestone
      @milestone = Milestone.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def milestone_params
      params.require(:milestone).permit(:creator_id, :partner_id, :type_of, :date)
    end
end
