<template>
    <div class="forum">
        <div class="allMyUtilisateurs">
            <h2>Les utilisateurs Groupomania</h2>
            <div class="Utilisateurs" style="flex-direction: column;">
                <div class="utilisateur">
                    <div id="user">
                    </div>
                    <div id="test">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
//import Utilisateurs from '@/components/Utilisateurs.vue'
import axios from "axios"; 
export default {
    name: 'MyUtilisateurs',
    data() {
        return {
            user : null,
            picture : null,
            id : null,
            userId : null,
            status : null,
            pictureAccount: null,
            idAccount: null,
            nameUser: null,
            lastNameUser: null,
            accountUserId:null,
            account: null
        };
    },
    created(){
        /** Route pour récupérer les utilisateurs **/
        axios.get("http://localhost:3030/api/user/all")
        .then(response => {
            console.log(response);
            this.user = response.data;
            console.log(this.user);
            this.userId = localStorage.getItem('userId');
        })
        .catch((error) => {
            console.log(error);
        });
        /** On récupère les account s'ils existent **/
        const monObjet = JSON.parse(localStorage.getItem('token'));
        let auth = 'bearer' + " " + monObjet.token;
        axios.get("http://localhost:3030/api/account/",{
            headers: {
                'Authorization': auth
            }
        })
        .then(response => {
            console.log(response);
            console.log(response.data);
            this.picture = response.data.media;
            this.id = response.data.userId;
            console.log(this.picture);
            console.log(this.userId);
            console.log(this.id);
        })
        .catch(function (error) {
            this.output = error;
        });
        /** On récupère le status de l'utilisateur connecté **/
        axios.get("http://localhost:3030/api/user",{
        headers: {
          'Authorization': auth
        }
        })
        .then(response => {
            this.status = response.data.status;
            console.log(this.status);
        })
        .catch(function (error) {
          this.output = error;
        });
        /** On récupère tous les account **/
        axios.get("http://localhost:3030/api/account/all")
        .then(response => {
            console.log(response)
            //affiche les données de l'account 
            this.account = response.data;
            console.log(this.account);
            console.log(response.data);
            for (let i of this.user) {
                console.log(i);
                this.nameUser = i.name;
                this.lastNameUser = i.lastName;
                this.accountUserId = i.id;
                console.log(this.pictureAccount);
                console.log(i.lastName)
                console.log(i.id);
                if(i.accountId === null) {
                    //si un user a comme valeur accountId null
                    document.getElementById('user').innerHTML+= `
                        <div>
                            <div style="height: inherit;width: 200px;background-color: grey;display: flex;justify-content: center;">
                                <p style="color: white;font-size: 65px;">?</p>
                            </div>            
                            <p>${this.nameUser}</p>
                            <p>${this.lastNameUser}</p>
                        </div>
                    `
                }
                var btn = document.createElement("BUTTON");
                btn.className = 'detailAccount';   
                btn.innerHTML += `${this.lastNameUser}`;
                /*btn.style.color='white';   
                btn.style.textAlign= 'center';
                btn.style.backgroundColor='cadetblue';
                btn.style.padding='10px 20px';
                btn.style.borderRadius='50%';
                btn.style.width='15%';
                btn.style.border='none';
                btn.style.textTransform = 'capitalize'; */    
                document.getElementById('test').appendChild(btn);
                btn.addEventListener("click", function() {
                    window.location.pathname='/accountAdmin/'+ i.id;
                    console.log('test')
                    let id = i.id
                    axios.get(`http://localhost:3030/api/account/${id}`)
                    .then(function (response) {
                        console.log(response);
                        console.log(response.data);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });   
                });
                console.log(this.status)
                if(this.status===1) {
                    var newDiv = document.createElement("div");
                        document.getElementById('test').appendChild(newDiv);
                        newDiv.className = 'supAccount';
                        console.log('pre-delete');
                        newDiv.addEventListener("click", function() {
                            console.log('delete');
                            let iduser = i.id;
                            const monObjet = JSON.parse(localStorage.getItem('token'));
                            let auth = 'bearer' + " " + monObjet.token;
                            console.log(auth);
                            axios.delete("http://localhost:3030/api/user/deleteAnyAccount", {
                                data: {iduser},
                                headers: {
                                    'Authorization': auth
                                }
                            }) 
                            .then(function (response) {
                                console.log(response);
                                alert('votre compte a été supprimé');
                                console.log("l'utilisateur est désinscrit")
                            })
                            .then(()=> {
                                window.location.replace('/Utilisateurs');
                            })
                            .catch(function (error) {
                                console.log(error);
                            }); 
                        });
                }
            }
            for (let objt of response.data) {
                this.pictureAccount = objt.media;
                this.idAccount = objt.id;
                console.log(objt)
                for (let i of this.user) {
                    console.log(i);
                    this.nameUser = i.name;
                    this.lastNameUser = i.lastName;
                    this.accountUserId = i.id;
                    console.log(this.pictureAccount);
                    console.log(i.lastName)
                    console.log(i.id);
                    if(objt.id === i.accountId) {
                        document.getElementById('user').innerHTML+= `
                            <div>
                                <img class="picture" src="${this.pictureAccount}" />
                                <p>${this.nameUser}</p>
                                <p>${this.lastNameUser}</p>
                            </div>
                        `
                    }
                }
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }
}
</script>
<style lang="scss">
    h2 {
      margin-top: 40px;
    }
    .Utilisateurs {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        .popUp {
            visibility: hidden;
        }
        .utilisateur {
            #user {
                display: flex;
                margin: 5%;
                flex-direction: row;
                justify-content: space-evenly;
                align-items: center;
                .picture {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    height: 200px;
                    width: 200px;
                    background-position: center;
                    background-size: cover;
                    background-repeat: no-repeat;
                    opacity: 70%;
                }
            }
            #test {
                width: auto;
                margin: 3px;
                padding: 2%;
                display: flex;
                .detailAccount {
                    color: white;
                    text-align: center;
                    background-color: cadetblue;
                    padding: 10px 20px;
                    border-radius: 50%;
                    width: 15%;
                    border: none;
                    text-transform: capitalize;                    
                }
            }
            p {
                color: black;
            }
            a {
                color: black;
                text-decoration: none;
                margin-bottom: 10%;
                &:hover {
                    .popUp {
                        visibility: visible;
                    }
                }
            }
            .pictureOut {
                height: 200px;
                width: 150px;
                .pictureNone {
                    height: inherit;
                    width: auto;
                    background-color: grey;
                    display: flex;
                    justify-content: center;
                    p {
                        color: white;
                        font-size: 65px;
                    }
                }
            }
            a {
                color: black;
                text-decoration: none;
                margin-bottom: 10%;
                &:hover {
                    .popUp {
                        visibility: visible;
                    }
                }
            }
        }
        .supAccount {
            background-image : url('./../assets/icones/trash-alt-regular.svg');
            width : 20px;
            height : 20px;
            background-repeat : no-repeat;
            background-size : cover;
            display: flex;
            filter: invert(1);
            margin: 2% auto;
        }
}
@media all and (min-width: 768px) {
    .allMyUtilisateurs {
        height: 600px;
        #test {
            width: auto;
            margin: 3%;
            background-color: cadetblue;
            padding: 2%;
            .supAccount {
                background-repeat : no-repeat;
                background-size : cover;
            }
        }
    }
}                                

@media all and (min-width: 650px) and (max-width: 766px) {
    .allMyUtilisateurs {
        height: auto;
        .Utilisateurs {
            .utilisateur {
                #user {
                    flex-direction: column;
                }
                #test {
                    width: auto;
                    margin: 5%;
                    background-color: cadetblue;
                    padding: 2%;
                }
            }
        }
    }
}

@media all and (max-width: 649px) {
    .allMyUtilisateurs {
        height: auto;
        .Utilisateurs {
            flex-wrap: initial;
        .utilisateur {
            #user {
                margin: auto;
                flex-direction: column;
            }
            #test {
                display: block;
                .detailAccount {
                    width: auto;                  
                }
                .supAccount {
                    filter: contrast(0.3);
                }
            }
        }
    }
    }
}
</style>