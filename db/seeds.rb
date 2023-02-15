# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)
genders = ["Man", "Woman", "Non-Binary"]
relationship_statuses = ["In a Relationship", "Single", "Married", "Engaged"]
booleans = [true, false]

20.times{User.create(full_name: Faker::TvShows::RuPaul.unique.queen,
                     email: Faker::Internet.unique.free_email,
                     gender: genders.sample,
                     date_of_birth: Faker::Date.birthday(min_age: 18, max_age: 99),
                     relationship_status: relationship_statuses.sample,
                     is_admin: false,
                     password: "kekkaishi",
                     profile_picture: Faker::Avatar.image,
                     username: Faker::Internet.unique.username,
                     profile_blurb: Faker::TvShows::RuPaul.quote
                     )}

User.create(full_name: "Terence Nip", email: "terence.nip@gmail.com", gender: "Man", date_of_birth: "Wed, 11 Mar 1992", relationship_status: "Married", is_admin: false, password: "kekkaishi", profile_picture: "https://scontent-lga3-1.xx.fbcdn.net/v/t1.6435-9/48412410_10161073106615332_1776658379276550144_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=IO4nH_iEEU8AX9Z6Ae3&_nc_ht=scontent-lga3-1.xx&oh=00_AfDvHAFK7jS8KfR_gALs0gQmu2CC-HWnUtNk6qlwxknS8A&oe=6408B773", username: "tnip", profile_blurb: "Married to Nicholas Nip, Currently at Google")

User.create(full_name: "Nicholas Nip", email: "nicholaskadenip@gmail.com", gender: "Non-Binary", date_of_birth: "Wed, 19 Feb 1997", relationship_status: "Married", is_admin: true, password: "kekkaishi", profile_picture: "https://media.licdn.com/dms/image/C5603AQGcEmJeKNADfg/profile-displayphoto-shrink_800_800/0/1557177089633?e=1681344000&v=beta&t=I5Awft2hnVPDgVkCTH58S5ZhxP7yG6dDxeRPi36u3Y4", username: "NicholasNip", profile_blurb: "Married to Terence Nip, Currently a Student at Flatiron School")

5.times{Opinion.create(thing: Faker::Food.dish, user_id: 22, owner_id: 21, liked: true)}

5.times{Chat.create(name: Faker::Company.name)}

Chat.create(name: "Nicholas and Terence")

ChatUser.create(chat_id: 6, user_id: 21)
ChatUser.create(chat_id: 6, user_id: 22)

Message.create(chat_id: 6, body: "Hello, love!", sender_id: 21)

ChatUser.create(chat_id: 1, user_id: 14)
ChatUser.create(chat_id: 1, user_id: 7)
ChatUser.create(chat_id: 1, user_id: 6)

ChatUser.create(chat_id: 2, user_id: 7)
ChatUser.create(chat_id: 2, user_id: 13)
ChatUser.create(chat_id: 2, user_id: 8)

ChatUser.create(chat_id: 3, user_id: 1)
ChatUser.create(chat_id: 3, user_id: 16)
ChatUser.create(chat_id: 3, user_id: 8)

ChatUser.create(chat_id: 4, user_id: 10)
ChatUser.create(chat_id: 4, user_id: 11)
ChatUser.create(chat_id: 4, user_id: 12)

ChatUser.create(chat_id: 5, user_id: 10)
ChatUser.create(chat_id: 5, user_id: 17)
ChatUser.create(chat_id: 5, user_id: 9)

Message.create(sender_id: 14, chat_id: 1, body: Faker::TvShows::RuPaul.unique.quote)
Message.create(sender_id: 7, chat_id: 1, body: Faker::TvShows::RuPaul.unique.quote)
Message.create(sender_id: 6, chat_id: 1, body: Faker::TvShows::RuPaul.unique.quote)

Message.create(sender_id: 7, chat_id: 2, body: Faker::TvShows::RuPaul.unique.quote)
Message.create(sender_id: 13, chat_id: 2, body: Faker::TvShows::RuPaul.unique.quote)
Message.create(sender_id: 8, chat_id: 2, body: Faker::TvShows::RuPaul.unique.quote)

Message.create(sender_id: 1, chat_id: 3, body: Faker::TvShows::RuPaul.unique.quote)
Message.create(sender_id: 16, chat_id: 3, body: Faker::TvShows::RuPaul.unique.quote)
Message.create(sender_id: 8, chat_id: 3, body: Faker::TvShows::RuPaul.unique.quote)

Message.create(sender_id: 10, chat_id: 4, body: Faker::TvShows::RuPaul.unique.quote)
Message.create(sender_id: 11, chat_id: 4, body: Faker::TvShows::RuPaul.unique.quote)
Message.create(sender_id: 12, chat_id: 4, body: Faker::TvShows::RuPaul.unique.quote)

Message.create(sender_id: 10, chat_id: 5, body: Faker::TvShows::RuPaul.unique.quote)
Message.create(sender_id: 17, chat_id: 5, body: Faker::TvShows::RuPaul.unique.quote)
Message.create(sender_id: 9, chat_id: 5, body: Faker::TvShows::RuPaul.unique.quote)

5.times{Post.create(user_id: rand(1..20), text: Faker::TvShows::RuPaul.unique.quote, image: nil, type_of: "text")}

5.times{Like.create(user_id: rand(1..20), post_id: rand(1..5))}

5.times{Comment.create(user_id: rand(1..20), post_id: rand(1..5), text: Faker::TvShows::RuPaul.unique.quote)}

3.times{Outing.create(name: "Date at Small Batch", location: "{lat: 40.7390087, lng: -73.6174783}", date: Date.new(2022, 10, 10), notes: "A great dinner!", rating: rand(1..5))}

OutingParticipant.create(user_id: 1, outing_id: 1)
OutingParticipant.create(user_id: 2, outing_id: 1)
OutingParticipant.create(user_id: 3, outing_id: 2)
OutingParticipant.create(user_id: 4, outing_id: 2)
OutingParticipant.create(user_id: 5, outing_id: 3)
OutingParticipant.create(user_id: 6, outing_id: 3)

Friendship.create(sender_id: 1, recipient_id: 2, confirmed: true, is_significant_other: true)
Friendship.create(sender_id: 3, recipient_id: 4, confirmed: true, is_significant_other: true)
Friendship.create(sender_id: 5, recipient_id: 6, confirmed: true, is_significant_other: true)
Friendship.create(sender_id: 2, recipient_id: 10, confirmed: false, is_significant_other: false)
Friendship.create(sender_id: 6, recipient_id: 12, confirmed: false, is_significant_other: false)
Friendship.create(sender_id: 10, recipient_id: 19, confirmed: true, is_significant_other: false)

Friendship.create(sender_id: 22, recipient_id: 21, confirmed: true, is_significant_other: true)

Post.create(user_id: 21, text: "Nicholas and I after our domestic partnership ceremony in June 2022.", type_of: "image", image: "https://scontent-lga3-1.xx.fbcdn.net/v/t39.30808-6/286778740_10217734738160091_8365823517785679848_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=DEO4D-vmz1oAX8SAKeZ&_nc_ht=scontent-lga3-1.xx&oh=00_AfCyZHbimp3OZ28txwLDifuh2ODra7N6BDG_N_Ti8EFJ-w&oe=63E5A4B2")

