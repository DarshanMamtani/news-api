# news-api
API where user can create, update and delete news

I have created the API only i.e. backend only. So, please check the endpoints by using API checking tools like Postman.


Setup:
1.	Clone the repository
2.	Open terminal and go to the path where cloned the repository.
3.	Type “npm install” to install the node-modules.
4.	Type “npm run start” and the server will start.
5.	Open Postman to check the below endpoints
Note: All the database information (dbname, user, password) is in “.env” file. Just change that file if you are changing the database name or user.

Routes:

1.	Post on ‘/signup’ <br />
o	To register the user and takes json in request object.<br />
o	Object will have three fields i.e. email (should be unique), name, password.<br />
e.g. <br />
{
    "name": "Darshan",<br />
    "email": "darshan123@gmail.com",<br />
    "password": "password"
}<br />

o	id will be generated automatically on database.<br />



2.	Put on ‘/login’<br />
o	Used to login the user.<br />
o	Takes json object in request body with parameters email and password<br />
e.g.<br />
{
    "email": "darshan123@gmail.com",<br />
    "password": "password"
}<br />


3.	Post on ‘/news’<br />
o	Used to create the news.<br />
o	Takes json object in request body with parameters title and description.<br />

e.g.<br />
{
    "title": "Demo News",<br />
    "description": " News by darshan123@gmail.com"
}<br />

o	The id of news and userid (i.e. id of user who created news) are added automatically.<br />
o	The id of every news is returned in response because while deleting and updating the news, news id is used.<br />


4.	Patch on ‘news’<br />
o	Used to update the news.<br />
o	Takes json object in request body with fields id, title and description.<br />

e.g.<br />
{
    "id": 5,<br />
    "title": "Demo",<br />
    "description": "Updated news by darshan123@gmail.com"
}<br />

o	Note: Only the user who has published the news will be able to update the news.<br />
5.	Delete on ‘/news’<br />
o	Used to delete the news.<br />
o	Takes json object in request body with field id.<br />
e.g.<br />
{
    "id": 5
}<br />
o	Note: Only the user who has published the news will be able to update the news.<br />


6.	Get on ‘/news’<br />
o	Used to get all the news present in database.<br />
o	No parameters passed.<br />

e.g.  http://localhost:3000/news<br />

7.	Get on ‘/news/:id’<br />
o	Used to get the news with specific id.<br />
o	News id is passes as parameter in url.<br />
e.g. http://localhost:3000/news/5<br />


Note: For all the routes of ‘news’, user must be logged in.
