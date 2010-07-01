# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_todos_session',
  :secret      => 'e7f10ee863514c6340a5e16b7b839d7287ef21bf301b71e29f43aef73fce4e6b3b7dc07ec7d2ca526cd36794c3034aaf6baeb5432a6f08a3253a72fe0673083e'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
