<template>
  <div class="allSections">
    <div class="user">
      <div class="picture">
        <img :src = "picture" v-if="picture != null" /> 
      </div>
      <div id="details">
        <form id="form" enctype='multipart/form-data' style="display: flex;align-items: center;flex-direction: column;">
          <label style="margin-bottom: 40px;">Ajouter une photo de profil</label>
          <input id="picture" accept="image/*" type="file">
          <button @click="newPicture">Ajouter photo</button>
          <!--<button @click="newPict" class="button">Changer de photo</button>-->
        </form>
      </div>
      <div id="detailsUser">
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
        <div style="display: flex;justify-content: space-evenly;">
          <h1>Qui suis-je?</h1>
          <img @click="editeProfil" src="./../assets/icones/edit-regular.svg" style="width : 30px;" />
        </div>
        <form id="form" v-if="edited == true" enctype='multipart/form-data'>
          <textarea type="text" placeholder="Ajouter une description" rows="10" cols="73" v-model="descript"></textarea>
          <button @click="newDescript">Changez votre description</button>
        </form>
        <p>
          {{this.description}}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
//import Account from '@/components/Account.vue'
import axios from "axios"; 
import FormData from 'form-data';
export default {
  name: 'MyAccount',
  data() {
    return {
      name : null,
      lastName : null,
      userName : null,
      mail : null,
      picture : null,
      edited : false,
      description : null,
      descript : null,
      id : null,
      nbPost : null,
      commentsShow : null,
      nbCom : null
    };
  },
  created(){
        const monObjet = JSON.parse(localStorage.getItem('token'));
        let auth = 'bearer' + " " + monObjet.token;
        //on récupère toutes les données de l'user
        axios.get("http://localhost:3030/api/user",{
        headers: {
          'Authorization': auth
        }
        })
        .then(response => {
          this.name = response.data.name;
          this.lastName = response.data.lastName;
          this.userName = response.data.userName;
          this.mail = response.data.mail;
          this.id = response.data.id
        })
        .then(()=>{
          //on récupère toutes les posts
          axios.get("http://localhost:3030/api/post")
          .then(response => {
              console.log(response);
              this.test = response.data;
              console.log(this.test);
              for(let object = 0; object < this.test.length; object++) {
                console.log(this.test[object].userId);
                //Si l'userId d'un post est identique à l'userId 
                if(this.test[object].userId === this.id){
                  console.log(this.test[object]);
                  //on incrémente +1 à la variable qui correspond au nb de posts
                  this.nbPost += 1
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
                if(this.commentsShow[object].userId === this.id){
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
        //on récupère les données de l'account qui a comme userId l'id de l'user
        axios.get("http://localhost:3030/api/account",{
        headers: {
          'Authorization': auth
        }
        })
        .then(response => {
          console.log(response.data);
          this.picture = response.data.media;
          console.log(this.picture);
          this.description = response.data.textDescription;
        })
        .catch(function (error) {
          this.output = error;
        });
  },
  methods : {
    //Formulaire pour ajouter l'image de profil
    newPicture() {
      var formData = new FormData();
      let img = document.getElementById('picture').files[0];
      formData.set('picture', img);
      console.log(...formData);
      console.log(img);
      const monObjet = JSON.parse(localStorage.getItem('token'));
      let auth = 'bearer' + " " + monObjet.token;
      console.log(auth);
      axios.post("http://localhost:3030/api/account", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': auth
        }
      })
      .then(function (response) {
        console.log(response);
        console.log(auth);
      })
      .catch(function (error) {
        this.output = error;
      });
    },
    //Formulaire pour changer l'image de profil
    newPict() {
      var formData = new FormData();
      let img = document.getElementById('picture').files[0];
      formData.set('picture', img);
      console.log(...formData);
      console.log(img);
      const monObjet = JSON.parse(localStorage.getItem('token'));
      let auth = 'bearer' + " " + monObjet.token;
      console.log(auth);
      axios.put("http://localhost:3030/api/account/picture", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': auth
        }
      })
      .then(function (response) {
        console.log(response);
        console.log(auth);
      })
      .catch(function (error) {
        this.output = error;
      });
    },
    //Apparition de Formulaire pour changer la description
    editeProfil() {
      this.edited = true;
    },
    //Formulaire pour changer la description
    newDescript() {
      var formData = new FormData();
      if(this.descript != null) {
        formData.append('textDescription', this.descript);
      } 
      console.log(...formData);
      console.log(this.descript);
      const monObjet = JSON.parse(localStorage.getItem('token'));
      let auth = 'bearer' + " " + monObjet.token;
      console.log(auth);
      axios.put("http://localhost:3030/api/account", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': auth
        }
      })
      .then(function (response) {
        console.log(response);
        console.log(auth);
        window.location.replace('/Account');
      })
      .catch(function (error) {
        this.output = error;
      });
    }
  }
}
</script>
<style lang="scss">
  .allSections {
    width: 75%;
    display: flex;
    margin-top: 40px;
    padding-bottom: 50px;
    .user {
      padding: 0 2% 70px 2%;
      margin-left: 20px;
      width: 20%;
      box-shadow: 11px 9px 4em 0px;
      .picture {
        display: block;
        background: black;
        border-radius: 50%;
        height: 200px;
        width: 150px;
        margin: 35px auto;
        img {
          border-radius: 50%;
          height: 200px;
          width: 150px;
          object-fit: cover;
        }
      }
      #details {
        label {
          margin: 0;
        }
        #picture {
          background-color: cadetblue;
          position: relative;
          bottom: 30px;
        }
        button {
          color: white;
          background-color: cadetblue;
          padding: 10px 20px;
          border-radius: 50%;
          border: 2px solid white;
          padding: 5%;
          font-size: 12px;
          text-transform: uppercase;
          font-weight: bold;
        }
        .button {
          color: white;
          background-color: #55bec1;
          padding: 10px 20px;
          border-radius: 50%;
          border: 2px solid white;
          padding: 5%;
          font-size: 12px;
          text-transform: uppercase;
          font-weight: bold;
        }
      }
      a {
        color: black;
        text-decoration: none;
        margin-bottom: 5%;
      }
    }
    .activity {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin: 20px 20%;
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
  .allSections {
    justify-content: space-evenly;
    .user {
      width: 45%;
    }
    .userActivity {
      width: 45%;
      .activity {
        justify-content: space-evenly;
        .circle {
          margin: 0;
        }
      }
    }
  }
}
//responsive mobile
@media all and (min-width: 420px) and (max-width: 767px) {
  .allSections {
    display: initial;
    width: 100%;
    .user {
      margin: 0;
      display: flex;
      padding: 0;
      flex-wrap: wrap;
      align-items: center;
      width: 100%;
      .picture {
        margin: 2% auto;
      }
      #details {
        flex-direction: row;
        margin: 0 auto;
        #form {
          flex-direction: row;
          label {
            margin: 0;
          }
          #picture {
            position: inherit;
            margin: 0 2%;
          }
        }
      }
      #detailsUser {
        margin: 5% 15%;
        display: flex;
        width: 100%;
        justify-content: space-around;
      }
    }
    .userActivity {
      width: 50%;
      display: flex;
      flex-direction: column-reverse;
      justify-content: space-around;
      flex-wrap: wrap;
      margin: 0 auto;
    }
    .activity {
      .circle {
        margin: 0 3%;
      }
    }
  }
}
//responsive mobile
@media all and (max-width: 420px) {
  .allSections {
    display: block;
    width: 100%;
    .user {
      width: 100%;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      #detailsUser {
        margin: 0;
        display: flex;
        flex-direction: column;
        width: 100%;
        justify-content: space-around;
      }
      #picture {
        left: 0;
      }
    }
    .userActivity {
      width: 100%;
      .activity {
        justify-content: space-evenly;
        .circle {
          width: 20%;
          margin: 0;
        }
      }
    }
  }
}
</style>
