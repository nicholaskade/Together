class OutingsController < ApplicationController
  skip_before_action :authorized_user, only: [:return_coordinates]
  before_action :set_outing, only: %i[ show update destroy ]

  def return_coordinates
    api_key = "AIzaSyBMkOLyU2LH7aEOFOv_cSka3UiPdKgHT5M"
    address_array = params[:address].split
    address_for_url = address_array.join("+")
    maps_url = "https://maps.googleapis.com/maps/api/geocode/json?address=#{address_for_url}&key=#{api_key}"

    response = RestClient.get(maps_url)
    response_json = JSON.parse(response.body)
    coordinates = response_json["results"][0]["geometry"]["location"]

    if coordinates.nil?
      render json: { "errors": "Google Maps did not return coordinates for the entered address." }
    else 
      render json: coordinates, status: :ok
    end
  end

  # GET /outings
  def index
    @outings = Outing.all

    render json: @outings
  end

  # GET /outings/1
  def show
    render json: @outing
  end

  # POST /outings
  def create
    outing = Outing.create!(outing_params)

    OutingParticipant.create!(outing_id: outing.id, user_id: params[:creator])

    OutingParticipant.create!(outing_id: outing.id, user_id: params[:so])

    if outing.save
      render json: outing, status: :created
    else
      render json: { "errors": "Unprocessable entity" }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /outings/1
  def update
    if @outing.update(outing_params)
      render json: @outing
    else
      render json: @outing.errors, status: :unprocessable_entity
    end
  end

  # DELETE /outings/1
  def destroy
    @outing.destroy
    render json: @outing, status: :ok
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_outing
      @outing = Outing.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def outing_params
      params.require(:outing).permit(:name, :location, :date, :notes, :rating)
    end
end
