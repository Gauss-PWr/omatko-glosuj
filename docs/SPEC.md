## Ideas

- [] push notif with "Voting ends in 5 min"
- [] fetch abstracts on vote component first open (or ditch abstracts whatsoever)

## Rules

1. Everyone can login.
2. There are 3 roles: Admin, Staff and Attendee.
3. Attendee can lock in one talk in a slot.
4. Attendee can vote.
5. Attendee can cancel their votes.
6. Staff inherits from attendee and can view live conference statistics.
7. Admin inherits from staff and can disable or enable votes.

## Enums

### Vote events

| kind           | description                        |
| -------------- | ---------------------------------- |
| talk_picked    | Talk has been but not voted on yet |
| score_cast     | Talk has been voted on             |
| vote_withdrawn | Vote has been deleted              |

### Presentation category

| category | description                   |
| -------- | ----------------------------- |
| t_1      | talk substance (merytoryka)   |
| t_2      | talk form (forma)             |
| p_1      | poster substance (merytoryka) |
| p_2      | poster aesthetics (estetyka)  |

## State

Talk, per member × slot:

```mermaid
stateDiagram-v2
    [*] --> Empty
    Empty --> Picked: TalkPicked
    Picked --> Picked: TalkPicked
    Picked --> Voted: ScoreCast
    Picked --> Empty: VoteWithdrawn
    Voted --> Voted: ScoreCast
    Voted --> Empty: VoteWithdrawn
```

## Data model

### users

| column      | type                                   |
| ----------- | -------------------------------------- |
| id          | integer PK                             |
| access_code | blob (hashed)                          |
| role        | `'attendee'` \| `'staff'` \| `'admin'` |

### slots

| column          | type                   |
| --------------- | ---------------------- |
| id              | integer PK             |
| timestamp_start | integer (timestamp_ms) |
| timestamp_end   | integer (timestamp_ms) |

### presentations

| column   | type                              |
| -------- | --------------------------------- |
| id       | integer PK                        |
| type     | `'talk'` \| `'poster'`            |
| slot_id  | integer \| null (FK `slots.id`)   |
| track    | `'applied'` \| `'theory'` \| null |
| title    | text                              |
| author   | text                              |
| abstract | text \| null                      |

### votes

| column          | type                                                     |
| --------------- | -------------------------------------------------------- |
| id              | integer PK                                               |
| user_id         | integer (FK `users.id`)                                  |
| presentation_id | integer (FK `presentations.id`)                          |
| kind            | vote_event enum                                          |
| category        | `'t_cat_1'` \| `'t_cat_2'` \| `'p_cat_1'` \| `'p_cat_2'` |
| score           | integer (default `0`)                                    |
| timestamp       | integer (timestamp_ms, default server time)              |

### current_votes

pointer table to the current vote

| column          | type           |
| --------------- | -------------- |
| user_id         | FK, partial UK |
| presentation_id | FK, partial UK |
| category        | partial UK     |
| vote_id         | FK             |

### current_slots

pointer table to picked presentation

| column          | type           |
| --------------- | -------------- |
| user_id         | FK, partial UK |
| slot_id         | FK, partial UK |
| presentation_id | FK             |

### app_settings

| column         | type                           |
| -------------- | ------------------------------ |
| voting_ends_at | integer (timestamp_ms) \| null |

### app_events

| column    | type                             |
| --------- | -------------------------------- |
| id        | integer PK                       |
| user_id   | integer \| null (FK `users.id`)  |
| event     | `'foreground'` \| `'background'` |
| timestamp | integer (timestamp_ms)           |

### sessions

| column    | type                                   |
| --------- | -------------------------------------- |
| id        | text PK                                |
| user_id   | integer (FK `users.id`)                |
| role      | `'attendee'` \| `'staff'` \| `'admin'` |
| expiresAt | integer (timestamp_ms)                 |

## API Endpoints

**BASE PATH:** /api

### general overview

| endpoint               | method | description                                                       | access                  |
| ---------------------- | ------ | ----------------------------------------------------------------- | ----------------------- |
| /login                 | POST   | login action, user passes code from the badge, session is created | any                     |
| /logout                | POST   | logout action, user session is deleted                            | admin, staff, attendees |
| /vote/{presentationId} | GET    | get vote for given presentation                                   | admin, staff, attendees |
| /vote/{presentationId} | POST   | post new vote for given presentation                              | admin, staff, attendees |
| /votes                 | GET    | get most recent votes for all presentations                       | admin, staff, attendees |
| /votes/disable         | POST   | starts countdown on server to disable votes                       | admin                   |
| /votes/enable          | POST   | cancles/enables voting immedietly                                 | admin                   |
| /stats                 | SSE    | recive stats about votes                                          | staff, admin            |

## Modules

### Backend modules

- Authentication
- Votes
- Settings
- Stats

```

```
