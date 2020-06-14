# News Finder
It's the core of Dailify. It's a process that is performed asynchronously, obtains the news from the rss URLs, and saves them to the database.

## Find Process
It exports the object that can start and stop the news finding process. Once started, it calls the find method of every newspaper's News Finder, repeating it until the process stop, at specific time intervals.

## News Finder Class
It's the class with the common properties of every newspaper's News Finder.

## Newspaper News Finders
They are the objects that contain the values and methods for finding the news for every journal. The find method takes a news array as a parameter and adds the found news to that array before returning it.
