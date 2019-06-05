![GalleryMatch logo](https://github.com/Wiebsonice/GalleryMatch/blob/master/wiki-assets/logo-horizontal.png)

# GalleryMatch
Datingsite for 40+ people who love to visit musea, and have a passion for art.

## Project tech CMD
This project is commissioned by CMD, for the Tech course. A Quick summary of the Tech course can be read below.

>In Project Tech you'll build a dynamic prototype of a web application. In different roles you take a well-argued position on, among other things, the privacy and security aspects of the application. You'll also learn to navigate the command line, version control with Git & GitHub and make sure code style is consistent.

And more info about the course can be found in [The CMD tech repository](https://github.com/cmda-bt/)

## Wiki
If you're intrested in the processes behind the made choice and research, be sure to check out [the GalleryMatch wiki](https://github.com/Wiebsonice/GalleryMatch/wiki)

## Packages
To see what packages are featured and used in this application, please have a look at the package.json file.

## Installation
1. Open your terminal
2. Install this repository
```
git clone https://github.com/Wiebsonice/GalleryMatch.git
```
3. Install the node modules
```
npm install
```

### .env
4. Make a `.env` file and place in your root folder.
5. your .env file should look similar to this:
```
DB_HOST=<db host>
DB_NAME=GalleryMatch
PORT=3000
SESSION_SECRET=<session secret>
```
6. Be sure to include the `.env` file in your `gitignore`

### If you want to use a local database follow these steps, otherwise skip to 9.
7. Specify the path to the local mongodb storage
```
mongod --dbpath <path to data directory>
```
8. Start your database (in a new terminal tab)
```
mongod
```
### Online database (if you have a local db skip to step 14)
9. mlab and mongodb offer free sandbox plans to basic users. Register an account.
10. Set up a cluster in mongodb call this cluster `gallerymatch`
11. Make a database, name this database `GalleryMatch`
12. add 2 collections to your database.
    - `account`
    - `ArtExpositions`
13. Get the connection string and save this in your `.env` file as `DB_HOST`.

### Starting the app
14. Run the application
```
npm run start
```
15. Use your browser to navigate to `http://localhost:3000` (the port can be set in `.env` as `PORT`)

## License
[MIT License](https://github.com/Wiebsonice/GalleryMatch/blob/master/license)
