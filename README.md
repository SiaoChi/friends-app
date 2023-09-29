[![NPM](https://img.shields.io/badge/NPM-ba443f?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![logo](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/)
[![logo](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://www.w3schools.com/html/)
[![tailwind](https://img.shields.io/badge/tailwind-CSS-%2361DAFB?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![docker](https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![elasticsearch](https://img.shields.io/badge/elasticsearch-005571?style=for-the-badge&logo=elasticsearch&logoColor=white)](https://www.elastic.co/)
[![socket.io](https://img.shields.io/badge/socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)

## YOUR FRIENDS APP
"Your Friends" app is a social networking app, dedicated to assisting individuals with family members suffering from dementia to make friends. It matches users based on their family members' conditions as tags and provides services for posting and chatting in chat rooms.

You may visit this website directly. ☞☞ [你的智友網站](https://chichi-lab.com/).
![home picture](https://d3ajxzni2jkkr0.cloudfront.net/userImage/20230726063843947)

## Server Structure
![server](https://github.com/SiaoChi/friends-app/assets/98171354/dd855488-edaf-430e-830e-c9ab10e38636)


## About the main feature description
Hi 🙋‍♀️ , I developed this project which included backend database design, RESTful API developments , chatroom , recommended system, and frontend development. 

### Search feature
❶ Visit to the homepage, you can see the search bar feature, which search bar connected to Elasticsearch. If you try to search consecutive words, Elasticsearch can extract the meaningful words to recommended you the best recommended articles.

https://github.com/SiaoChi/friends-app/assets/98171354/76dd1fde-3b6c-4f43-be3a-6af10107c459

### Chatroom feature

❷-1 Utilized Socket.IO to create a real-time chat room integrated with a MySQL database, featuring an unread message functions.

https://github.com/SiaoChi/friends-app/assets/98171354/88f773e0-5ecf-48b9-a5e5-f9b5949cbe1c

❷-2 You can check history messages by click chat list, when you scroll up to top, you will call pagination API to update the history messages.

https://github.com/SiaoChi/friends-app/assets/98171354/e551ed3f-c0fd-43a4-9e15-f6ff60b50846

### Recommend friends feature


❸ Designed and implemented a recommended friends system using user information as tags, using inverted index to optimize the speed of calculating

https://github.com/SiaoChi/friends-app/assets/98171354/bc59fc1e-b82d-4313-800a-5c9752845ab8

### Content-created feature

❹ Developed article functions using CRUD (Create, Read, Update, Delete) operations, integrating React with MySQL.

https://github.com/SiaoChi/friends-app/assets/98171354/44f6c07e-1638-428c-99e6-db8a1e70b7a4


❺ Using a Dockerfile to deploy my project to EC2, improving deployment efficiency

## SQL Database Schema
![db](https://github.com/SiaoChi/friends-app/assets/98171354/f701b9b5-dbe9-479e-9c63-fe183c2e2a21)

## K6 concurrency test
❶ Get user chatroom history messages data -> CUP 18-20% usage, and status 200 100%
![你的智友專案測試 003](https://github.com/SiaoChi/friends-app/assets/98171354/386b1b18-2101-4263-9967-012bf07afd87)

❷ Get user recommend's friends data -> CUP 18-20% usage, and status 200 100%
![你的智友專案測試 007](https://github.com/SiaoChi/friends-app/assets/98171354/260563cc-2224-443d-908c-47c8bda7e9b0)

#### test video
https://github.com/SiaoChi/friends-app/assets/98171354/9e0e81a1-362c-4109-ab85-333839e97d3d

## APP Relevant Skills

#### Programming Lanuage:
- JavaScript / TypeSript

#### Framework:
- Node.js
- Express

#### Database:
- Elasticsearch
- MySQL
- Redis

#### AWS Service:
- S3
- CloudFront
- RDS
- EC2

#### Others:
- Tailwind CSS
- Socket.IO
- Docker
- CICD Gitflow

## Test account

- email : test4@gmail.com
- password : 1111


