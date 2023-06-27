/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./views/partials/header.ejs",
    "./views/partials/footer.ejs",
    "./views/chatRoom.ejs",
    "./views/chatRoom1.ejs",
    "./views/chatRoom2.ejs",
    "./views/chatRoom3.ejs",
    "./views/login.ejs",
    "./views/userProfile.ejs",
    "./views/userProfileForm.ejs",
    "./views/userProfileById.ejs",
    "./views/recommendFriends.ejs",
    "./views/index.ejs",
    "./views/404.ejs",
    "./views/createArticle.ejs",
    "./views/admin.ejs",
    "./views/about.ejs",
    "./views/createTags.ejs",
    "./views/articles.ejs",
    "./views/singleArticle.ejs",
    "./views/editArticle.ejs",
    "./views/searchArticles.ejs"

  ],
  theme: {
    extend: {
      height:{
        'vh-50':'50vh',
        'vh-10':'10vh',
        'vh-15':'15vh',
        'vh-75':'75vh',
        'vh-90':'90vh',
        'vh-100':'100vh'
      },
      width:{
        'vw-50':'50vw',
        'vw-40':'40vw',
        'vw-30':'30vw'
      }
    },
  },
  plugins: [],
}

