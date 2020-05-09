# user

# error
- change redirect in middleware
- try add some error handling (send error state) in the routes that find news for ajax

# news
- @ add the likes system
    - news model stores likes number
    - user model stores liked news ids
    - @ create a route (to respond ajax request) that stores likes (both in the news and user collection) or remove it if the news is already liked by that user. The route must check the session of the user.
    - if the user is not logged-in, don't show like button and don't allow likes.
- update the route that find news and sends xml in order to send also ids of news
    
# home

# db
- create a config

# config