
## Ideas

- [] push notif with "Voting ends in 5 min"

## Data model

user
  id
  access_code -- hashed
  role
  
app_event
  id
  user_id
  event       -- 'foreground' or 'background'
  timestamp   -- server time

slots
  id
  start_timestamp
  end_timestamp

presentation
  id
  type          -- 'talk' or 'poster'
  slot_id       -- set for talks, null for posters
  track         -- 'theory' / 'applied', null for posters
  title
  author
  abstract

vote
  id
  user_id
  presentation_id
  category       -- 'pick', 'cat1', 'cat2'   (or 'active' for poster on/off)
  score          -- 1 for 'pick', 1-5 for 'cat1'/'cat2'
  timestamp      -- set by the server, not the client

event_settings
  voting_ends_at
