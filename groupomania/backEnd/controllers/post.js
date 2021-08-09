const auth = require('../middleware/auth');
const Posts = require ('../models/posts');
const User = require('../models/users');
const Comment = require ('../models/commentaires');
const jwt = require('jsonwebtoken');
const fs = require('fs');
exports.posts = async (req , res, next) =>{

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    const postsObject = req.body;
    console.log(req.body.message)
    var d = new Date();
    var date = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
    console.log(date);
    var d = new Date();
    var hours = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    console.log(hours);
    let image;
    let message;
    if(req.file) {
        image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }
    if(req.body.message) {
        message = req.body.message
    }
    Posts.create({ //Cannot read property 'filename' of undefined
        'message': message, 
        'date': date,
        'time':hours,
        'media': image,
        //(node:13208) UnhandledPromiseRejectionWarning: ReferenceError: userId is not defined
        'userId' : userId
    })
    .then(() => {
        console.log(userId);
        //console.log(Posts);
        res.sendStatus(200);
    })
    .catch(error => {
        console.log(error);
        res.status(400).json({ error })
    });
};

exports.editPost = async (req, res, next) => {
    // on souhaite récupérer le dernier index inséré dans la base de données et l'utiliser
        const posts = Posts.findAll()
        .then(posts => {
            console.log('et je suis là')
            //console.log(posts);
            posts.forEach((Posts) => {
                postId = Posts.id;
                //media = String(Posts.media);
                console.log(postId);
                console.log(Posts.message);
                console.log(Posts.media);
                console.log(Posts.date);
                console.log(postId);
                console.log(Posts.userId);
            })
            res.send(posts);
            res.sendStatus(200);
        })
        .catch(error => {
            console.log(error);
            res.status(400).json({ error })
        })
};
exports.modifyPost = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;

    const handleSuccessfulDeletion = () => {
        res.sendStatus(200);
    }
    const handleError = (error) => {
        error => res.status(500).json({ error })
    }
    console.log(req.body, userId);
    let status;
    User.findOne({ where: {id: userId} })
    .then(user=> {
        status = user.status;
    })
    if(status === 1 || userId === userId) {
        console.log(userId);
        let message = '' ;
        let image = '';
        Posts.findOne({ where: { id: req.body.postId} })
            .then(post => {
                message = post.message
                image = post.media;
                    if(req.body.message != ""){
                        message = req.body.message;
                    } 
    /**-S’il n’y a pas d’image sur le post ERREUR (Impossible d’ajoute l’image) à faire fonctionner */
                    if(req.file){
                        const filename = post.media.split("/images/")[1];
                        console.log(filename);
                        fs.unlink(`images/${filename}`, function (err) {
                          if (err) throw err;
                          // if no error, file has been deleted successfully
                          console.log('File deleted!');
                          console.log(filename);
                        });
                        image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
                    }
                    console.log(image);
                    post.update({
                        message: message,
                        media : image
                    })
                    console.log(message);
                    console.log(image);
                    console.log('post');
                    console.log(post);
                    // console.log('admin');
                    res.send(post);
                // })

                
            })
            .then(handleSuccessfulDeletion)
            .catch(handleError)
    }
};
exports.deletePost = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    console.log(req.body);
        console.log(req.body.idpost.id);
        //27 === id du post
        User.findOne({ where: {id: userId} })
        //on cherche le user qui a comme comme id le userId envoyé en requête
        .then(user=> {
            console.log(user.status)
            //on récupére le status du user
            // 1 == admin     _      0 == user lambda
            if(user.status === 1 ) {
                //si status admin
                    //on supprime le commentaire
                Comment.destroy({
                    where : {
                        postId : req.body.idpost.id
                    }
                })
                //on supprime le post
                Posts.findOne({
                    where: {
                        id : req.body.idpost.id
                    }
                })
                .then(post => {
                    console.log(post)
                    console.log(post.media)
                    const filename = post.media.split("/images/")[1];
                    console.log(filename);
                    fs.unlink(`images/${filename}`, function (err) {
                        if (err) throw err;
                            console.log('File deleted!');
                            console.log(filename);
                        });
                })
                .then(()=> {
                    Posts.destroy({
                        where: {
                            id : req.body.idpost.id
                        }
                    })
                })
                .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
                .catch(error => res.status(400).json({ error }));
            }
            if(user.status === 0) {
                Comment.destroy({
                    where : {
                        postId : req.body.idpost.id
                    }
                })
                Posts.findOne({
                    where: {
                        id : req.body.idpost.id,
                        userId: userId
                    }
                })
                .then(post => {
                    console.log(post)
                    console.log('post')
                    console.log(post.media)
                    const filename = post.media.split("/images/")[1];
                    console.log(filename);
                    fs.unlink(`images/${filename}`, function (err) {
                        if (err) throw err;
                            console.log('File deleted!');
                            console.log(filename);
                        });
                })
                .then(()=> {
                    Posts.destroy({
                        where: {
                            id : req.body.idpost.id,
                            userId: userId
                        }
                        
                    })
                })
                .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
                .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
    };