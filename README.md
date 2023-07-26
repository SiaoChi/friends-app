## YOUR FRIENDS APP
"Your Friends" app is a social networking app, dedicated to assisting individuals with family members suffering from dementia to make friends. It matches users based on their family members' conditions as tags and provides services for posting and chatting in chat rooms.

## Relevant skills
Node.js |  Express  |  Socket.IO  |  Elasticsearch  |  MySQL  |  Redis  |  Docker |  AWS 


## Functions and skills description
1. Build a web project that included backend database design, RESTful API developments, and frontend development and project planning

2. Utilized Socket.io to create a real-time chat room integrated with a MySQL database, featuring an unread message functions

3. Designed and implemented a recommended friends system using user information as tags, using inverted index to optimize the speed of calculating

4. Expanded the search functionality by incorporating Elasticsearch database, sync it with the main MySQL database, and providing users with relevant articles.

5. Using a Dockerfile to deploy my project to EC2, improving deployment efficiency.

6. Developed article functions using CRUD (Create, Read, Update, Delete) operations, integrating React with MySQL

## Run app in localhost

```
git clone {url}
npm install
npm run build
```

## APP structure

```
├── Dockerfile
├── README.md
├── backup.sql
├── controllers
│   ├── admin.ts
│   ├── articles.ts
│   ├── chatRoom.ts
│   ├── friends.ts
│   ├── search.ts
│   └── user.ts
├── docker-compose.yml
├── elasticSearch
│   └── search.ts
├── index.ts
├── jest.config.ts
├── k6
│   ├── jerry.yml
│   └── script.js
├── middleware
│   ├── authenticate.ts
│   ├── imageHandler.ts
│   └── ratelimiter.ts
├── models
│   ├── admin.ts
│   ├── articles.ts
│   ├── chatRoom.ts
│   ├── databasePool.ts
│   ├── friends.ts
│   ├── redisClient.ts
│   ├── s3.ts
│   ├── search.ts
│   ├── user.ts
│   └── userLogin.ts
├── package-lock.json
├── package.json
├── routers
│   ├── admin.ts
│   ├── articles.ts
│   ├── chatRoom.ts
│   ├── friends.ts
│   ├── index.ts
│   ├── search.ts
│   └── user.ts
├── socket
│   └── socketHandler.ts
├── tailwind.config.js
├── tests
│   ├── project.test.ts
│   └── sum.ts
├── tsconfig.json
├── utils
│   ├── errorHandler.ts
│   ├── generateToken.ts
│   └── verifyJWT.ts
└── views
    ├── 404.ejs
    ├── about.ejs
    ├── admin.ejs
    ├── articles.ejs
    ├── chatRoomMain.ejs
    ├── createArticle.ejs
    ├── createTags.ejs
    ├── editArticle.ejs
    ├── friends.ejs
    ├── index.ejs
    ├── login.ejs
    ├── partials
    │   ├── header.ejs
    │   └── sideBar.ejs
    ├── recommendFriends.ejs
    ├── searchFriends.ejs
    ├── singleArticle.ejs
    ├── userProfile.ejs
    ├── userProfileById.ejs
    └── userProfileForm.ejs

```


## Images

![This is an alt text.](/dist/img/demo1.png "home picture")
![This is an alt text.](/dist/img/demo2.png "chatroom picture")


## Official website

You may check website [你的智友網站](https://chichi-lab.com/).
