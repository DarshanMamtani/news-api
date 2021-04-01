# news-api
API where user can create, update and delete news

I have created the API only i.e. backend only. So, please check the endpoints by using API checking tools like Postman.


Setup:
1.	Unzip the folder.
2.	Open terminal and go to the path where folder is unzipped.
3.	Type “npm install” to install the node-modules.
4.	Type “npm run start” and the server will start.
5.	Open Postman to check the below endpoints
Note: All the database information (dbname, user, password) is in “.env” file. Just change that file if you are changing the database name or user.

Routes:

1.	Post on ‘/signup’
o	To register the user and takes json in request object.
o	Object will have three fields i.e. email (should be unique), name, password.
e.g. 
{
    "name": "Darshan",
    "email": "darshan123@gmail.com",
    "password": "password"
}

o	id will be generated automatically on database.



2.	Put on ‘/login’
o	Used to login the user.
o	Takes json object in request body with parameters email and password
e.g.
{
    "email": "darshan123@gmail.com",
    "password": "password"
}


3.	Post on ‘/news’
o	Used to create the news.
o	Takes json object in request body with parameters title and description.

e.g.
{
    "title": "Demo News",
    "description": " News by darshan123@gmail.com"
}

o	The id of news and userid (i.e. id of user who created news) are added automatically.
o	The id of every news is returned in response because while deleting and updating the news, news id is used.


4.	Patch on ‘news’
o	Used to update the news.
o	Takes json object in request body with fields id, title and description.

e.g.
{
    "id": 5,
    "title": "Demo",
    "description": "Updated news by darshan123@gmail.com"
}

o	Note: Only the user who has published the news will be able to update the news.
5.	Delete on ‘/news’
o	Used to delete the news.
o	Takes json object in request body with field id.
e.g.
{
    "id": 5
}
o	Note: Only the user who has published the news will be able to update the news.


6.	Get on ‘/news’
o	Used to get all the news present in database.
o	No parameters passed.

e.g.  http://localhost:3000/news

7.	Get on ‘/news/:id’
o	Used to get the news with specific id.
o	News id is passes as parameter in url.
e.g. http://localhost:3000/news/5


Note: For all the routes of ‘news’, user must be logged in.
