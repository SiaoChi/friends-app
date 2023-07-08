/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./views/partials/header.ejs",
    "./views/partials/footer.ejs",
    "./views/chatRoom.ejs",
    "./views/chatRoomTest1.ejs",
    "./views/chatRoomTest2.ejs",
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
    "./views/searchArticles.ejs",
    "./views/test.ejs",
    "./views/partials/sideBar.ejs",
    "./views/**.ejs"
  ],
  theme: {
    extend: {
      height:{
        'vh-10':'10vh',
        'vh-15':'15vh',
        'vh-20':'20vh',
        'vh-25':'25vh',
        'vh-30':'30vh',
        'vh-35':'35vh',
        'vh-40':'40vh',
        'vh-50':'50vh',
        'vh-60':'60vh',
        'vh-80':'80vh',
        'vh-75':'75vh',
        'vh-90':'90vh',
        'vh-100':'100vh'
      },
      width:{
        'vw-10':'10vw',
        'vw-15':'15vw',
        'vw-20':'20vw',
        'vw-25':'25vw',
        'vw-30':'30vw',
        'vw-35':'35vw',
        'vw-40':'40vw',
        'vw-50':'50vw',
        'vw-60':'60vw',
        'vw-70':'70vw',
        'vw-75':'75vw',
        'vw-90':'90vw',
        'vw-100':'100vw'
      },
      colors:{
        'transparent':'transparent',
        'blue':'#2198DD',
        'red':'#f075c6',
        'light-pink':'#ffe0e0',
        'orange':'#FDCDB9'
      },
      fontFamily: {
        sans: ['Graphik', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      backgroundImage:{
        'home':"url('/img/kv_bg.png')"
      }
    },
  },
  plugins: [],
}

