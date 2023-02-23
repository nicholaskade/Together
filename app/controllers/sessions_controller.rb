class SessionsController < ApplicationController
    skip_before_action :authorized_user, only: [:create, :check_sign_in]

    def create
        user = User.find_by(email: params[:email])
        # debugger
        if user&.authenticate(params[:password])
            session[:user_id] = user.id
            render json: user, status: :ok
        else 
            render json: { errors: 'Invalid Email or Password' }, status: 401
        end
    end

    def destroy
        session.destroy
        head :no_content
    end

end