class OutingParticipantsController < ApplicationController
  before_action :set_outing_participant, only: %i[ show update destroy ]

  # GET /outing_participants
  def index
    @outing_participants = OutingParticipant.all

    render json: @outing_participants
  end

  # GET /outing_participants/1
  def show
    render json: @outing_participant
  end

  # POST /outing_participants
  def create
    @outing_participant = OutingParticipant.new(outing_participant_params)

    if @outing_participant.save
      render json: @outing_participant, status: :created, location: @outing_participant
    else
      render json: @outing_participant.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /outing_participants/1
  def update
    if @outing_participant.update(outing_participant_params)
      render json: @outing_participant
    else
      render json: @outing_participant.errors, status: :unprocessable_entity
    end
  end

  # DELETE /outing_participants/1
  def destroy
    @outing_participant.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_outing_participant
      @outing_participant = OutingParticipant.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def outing_participant_params
      params.require(:outing_participant).permit(:outing_id, :user_id)
    end
end
