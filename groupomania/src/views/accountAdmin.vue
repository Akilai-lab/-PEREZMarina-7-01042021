<template>
  <div class="allSectionsUsers">
    <div class="user">
      <div class="picture" v-if="accountId==actualUserId">
        <img :src = "picture" /> 
      </div>
      <div class="picture" v-if="accountId!=actualUserId">
      </div>
      <div id="detailsProfil">
        <p>{{this.name}}</p>
        <p>{{this.lastName}}</p>
        <p>{{this.userName}}</p>
        <p>{{this.mail}}</p>
      </div>
    </div>
    <div class="userActivity">
      <div class="activity">
        <div class="circle"><span>{{nbCom}}</span></div>
        <p>Commentaires</p>
      </div>
      <div class="activity">
        <div class="circle"><span>{{nbPost}}</span></div>
        <p>Posts</p>
      </div>
      <div class="myProfil">
        <h1>Qui suis-je?</h1>
        <p>
          {{descript}}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
//import AccountAdmin from '@/components/AccountAdmin.vue'
import axios from "axios"; 
export default {
  name: 'MyAccountAdmin',
data() {
    return {
      test : null,
      commentsShow : null,
      postShow : null,
      lastName : null,
      name : null,
      userName : null,
      mail : null,
      picture : null,
      accountId : null,
      actualUserId : null,
      nbPost : null,
      nbCom : null,
      descript : null
    };
  },
  created(){
    //On récupère les données de l'user qui a été ciblé
    axios.get(`http://localhost:3030/api/account/${this.$route.params.id}`)
    .then(response => {
      console.log(response.data);
      this.lastName = response.data.lastName,
      this.name = response.data.name,
      this.userName = response.data.userName,
      this.mail = response.data.mail
      this.accountId = this.$route.params.id;
      console.log(this.accountId)
    })
    .catch(function (error) {
      this.output = error;
    });
    /*const monObjet = JSON.parse(localStorage.getItem('token'));
    let auth = 'bearer' + " " + monObjet.token;*/

    //On récupére les données des accounts
    axios.get("http://localhost:3030/api/account/all"/*,{
      headers: {
        'Authorization': auth
      }
    }*/)
    .then(response => {
      //response data est égal à un compte dans account mais pas celui de redirection
      console.log(response.data);// est l'userId présent dans la table account
      /**le but est de vérifier s'il y a dans la bdd un account qui a comme userId le id de l'user */
      for(let i of response.data) {
        console.log(this.accountId);
        console.log(i.userId);
        console.log(i.media);
        if(this.accountId == i.userId) {
          //Si un accountId (this.$route.params.id) est identique à l'userId de l'account
          console.log(i.media)
          this.descript = i.textDescription;
          this.actualUserId = i.userId;
          this.picture = i.media;
          console.log(i.userId);
          console.log(this.picture);
        }
      }
    })
    .then(()=> {
      //On récupère tous les posts
      axios.get("http://localhost:3030/api/post")
      .then(response => {
        console.log(response);
        this.test = response.data;
        console.log(this.test);
        for(let object = 0; object < this.test.length; object++) {
          console.log(this.test[object].userId);
          console.log(this.accountId);
          //Si l'userId d'un post est identique à l'userId 
          if(this.test[object].userId === this.actualUserId){
            //on incrémente +1 à la variable qui correspond au nb de posts
            this.nbPost += 1
            console.log(this.nbPost)
          }
          else {
            this.nbPost = 0
          }
        }
        console.log(this.nbPost)
      })
      //On récupère tous les commentaires
      axios.get("http://localhost:3030/api/comment")
      .then(response => {
        this.commentsShow = response.data;
        for(let object = 0; object < this.commentsShow.length; object++) {
          console.log(this.commentsShow[object].userId);
          //Si l'userId d'un post est identique à l'userId
          if(this.commentsShow[object].userId === this.actualUserId){
            console.log(this.commentsShow[object]);
            //on incrémente +1 à la variable qui correspond au nb de commentaires
            this.nbCom += 1
          }
          else {
            this.nbCom = 0;
          }
        }
        console.log(this.nbCom)
      })
      .catch(function (error) {
        this.output = error;
      });
    })
    .catch(function (error) {
      this.output = error;
    });
  }
}
</script>

<style lang="scss">
  .allSectionsUsers {
    width: 75%;
    display: flex;
    margin-top: 40px;
    padding-bottom: 50px;
    .user {
      padding: 0 2% 70px 2%;
      margin-left: 20px;
      width: 50%;
      box-shadow: 11px 9px 4em 0px;
      .picture {
        display: block;
        background: black;
        border-radius: 50%;
        height: 200px;
        width: 150px;
        margin: 35px auto;
      }
      a {
        color: black;
        text-decoration: none;
        margin-bottom: 5%;
      }
    }
    .activity {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      margin: 20px auto;
      .circle {
        display: inline-block;
        width: 50px;
        height: 50px;
        margin: 0 40px 0 20%;
        border-radius: 50%;
        position: relative;
        color: white;
        background: radial-gradient(circle at 50% 120%, #f68f81, #ef8176 10%, #941e05 80%, #450d06 100%);
        span {
          position: relative;
          top: 30%;
        }
      }
      .circle:before {
        content: "";
        position: absolute;
        top: 1%;
        left: 5%;
        width: 90%;
        height: 90%;
        border-radius: 50%;
        background: radial-gradient(circle at 50% 0px, #ffffff, rgba(255, 255, 255, 0) 58%);
        filter: blur(5px);
        z-index: 2;
      }
    }
    .myProfil {
      margin-top: 60px;
      p {
        width: 70%;
        margin: 0 auto;
      }
    }
    h2 {
      margin-top: 40px;
    }
    .myGroups {
      display: flex;
      justify-content: space-evenly;
      margin-top: 50px;
      .group {
        height: 200px;
        width: 150px;
        background-color: grey;
        display: flex;
        justify-content: flex-end;
        flex-direction: column;
        a {
          color: white;
          text-decoration: none;
          margin-bottom: 10%;
        }
      }
    }
  }
@media all and (min-width: 768px) {
  .allSectionsUsers {
    margin-top : 0;
    .user {
      .picture {
        img {
          border-radius: 50%;
          height: 200px;
          width: 150px;
        }
      }
    }
    .userActivity {
      width: 50%;
    }
  }
}                                
//responsive mobile
@media all and (min-width: 420px) and (max-width: 767px) {
  .allSectionsUsers {
    display: initial;
    width: 100%;
    .user {
      margin: 0;
      padding: 0;
      width: 100%;
      display: flex;
      flex-direction: column;
      .picture {
        margin: 2% auto;
        img {
          border-radius: 50%;
          height: 200px;
          width: 150px;
        }
      }
    }
    .userActivity {
      width: initial;
      .activity {
        justify-content: center;
        .circle {
          margin: 10px 15px;
        }
      }
    }
  }
}
@media all and (max-width: 420px) {
  .allSectionsUsers {
    display: block;
    width: 100%;
    .user {
      width: 100%;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      .picture {
        height: 222px;
        width: 180px;
        img {
          border-radius: 50%;
          height: 222px;
          width: 180px;
        }
      }
    }
    .userActivity {
      width: initial;
      .activity {
        justify-content: space-evenly;
        .circle {
          margin: 0;
        }
      }
    }
  }
}
</style>
