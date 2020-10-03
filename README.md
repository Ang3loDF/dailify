# Dailify

A website that takes news from some important newspapers and assembles them on a single page. It uses rss news feeds and lets the user create an account with specific interests to receive customized news.

## Getting Started

### Prerequisites

To run this app on your local machine you need NodeJS installed on your computer and a MongoDB database accessible via url.

### Installing

You can simply install this app with a pull request, but you have to install the dipendencies and set up your private keys.

### Installing dependencies
Move to the app folder with the command and type:
```
npm install
```

### Set Up Private Keys

Go to 'config->privateKey.js', open the file with a text editor and change: 
```
DATABASE_URL: "",
SESSION_KEY: ""
```
with:
```
DATABASE_URL: "your://mongoDB/database/url",
SESSION_KEY: "some random words"
```

## Built With

* [ExpressJS](https://expressjs.com/) - The web framework used.
* [Bootstrap](https://getbootstrap.com/) - The front-end framework used.

## Authors

* **Angelo Di Fuccia** - [Ang3loDF](https://github.com/Ang3loDF)

## What About It

Feel free to let me know if there are any issues or bugs, I'm going to improve.
