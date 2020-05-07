# user
- @ create an inputs validation before to add them to database
    - email validation
    - password validation
    - name validation
    - topics validation

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