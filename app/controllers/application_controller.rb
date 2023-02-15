class ApplicationController < ActionController::API
    include ActionController::Cookies

    before_action :authorized_user

    def current_user
        if (session) 
            user = User.find_by(id: session[:user_id])
            user
        else 
            nil
        end 
    end

    def authorized_user
        render json: { error: "Not Authorized" }, status: :unauthorized unless current_user
    end 
      
end