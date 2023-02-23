Rails.application.routes.draw do

  mount ActionCable.server => "/cable"

  resources :milestones
  resources :opinions
  resources :comments
  resources :outings
  resources :posts
  resources :likes
  resources :outing_participants
  resources :friendships
  resources :users
  resources :chat_users
  resources :chats
  resources :messages

  get "/check_sign_in", to: "users#show"
  post "/signin", to: "sessions#create"
  delete "/signout", to: "sessions#destroy"

  get "users/friends/:id", to: "users#friends"
  get "user/:id/dm/:friend_id", to: "users#dms"
  get "user/:id/significant_others", to: "users#significant_others"
  get "user/:id/opinions/:friend_id", to: "users#so_opinions"
  get "user/:id/dates/:friend_id", to: "users#dates"
  get "user/:id/make_significant/:friend_id", to: "users#make_so"
  get "user/:id/friends_with_chats", to: "users#friends_with_chats"

  get "user/:id/posts", to: "posts#user_posts"

  get "post/:id/comments", to: "posts#comments"

  get "user/:id/likes", to: "likes#user_likes"
  delete "user/:id/like/:post_id", to: "likes#destroy"

  delete "user/:id/unfriend/:friend_id", to: "users#unfriend"

  post "/get_coords", to: "outings#return_coordinates"

  get "/user/:id/milestones", to: "milestones#user_milestones"
end