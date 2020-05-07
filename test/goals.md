# user
- create a user profile page with accessibility restriction
    - create a system to set interests
        - add some error hendling when retrieve topics from the form values in the routes (if the topics doesn't exist for exeple)
    - change password 
    - change name
    - other impostations...
- create an email validation

# error
- change the redirect routes of errors to news
- make a better error hendling in the callbacks of the dbs queries (check if the element has been found, not only the error)

# news
- add a property 'topics' to NewsFinder class (an array of all the possible topics), in order to check the existence of the topics in other part of the project.
    
# home
- add a system to view only interested topics news

# db
- create a config

# config
- crate a private keys file
    - add db and express-session keys
    - may add also all the possible news topics (don't like so much to add it here)