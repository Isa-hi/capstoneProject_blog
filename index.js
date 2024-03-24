import express from 'express';
import ejs from 'ejs';
import bodyParser from 'body-parser';
import multer from 'multer';

const app = express();
const port = 3000;
let postsArray = [];
let postId = 0;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));

// Set up multer to save uploaded files to a folder
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images/'); // Define the destination folder
    },
    filename: function(req, file, cb) {
        // Extract the file extension from the original filename
        const fileExtension = file.originalname.split('.').pop();
        // Use a constant filename with a unique number and the original file extension appended
        cb(null, 'image_' + Date.now() + '.' + fileExtension);
    }
});

const upload = multer({storage: storage});

app.get("/", (req, res) => {
    //console.log(postsArray[0].titulo);
    res.render("index.ejs", {postsArray});
})

app.get("/create-post", (req, res) => {
    res.render("createPost.ejs")
})

app.post("/submit-createPost", upload.single('postImagen'), (req, res) => {
    let postTitle = req.body.postTitulo;
    let postImagen = req.file.filename;
    let postContenido = req.body.postContenido;
    postsArray.unshift({"postId": postId++, "titulo": postTitle, "imagen" : "images/" + postImagen, "contenido" : postContenido});
    res.redirect("/");
})

app.get("/view-post", (req, res) => {
    let id = req.query.id; //It's the named that's passed in the URL
    let currentPost = {};
    postsArray.forEach(post => {
        if(post.postId == id){
            currentPost = post;
        }
    });
    res.render("viewPost.ejs", {currentPost});

})

app.get("/edit-post", (req, res) => {
    let id = req.query.id; //It's the named that's passed in the URL
    console.log("Id- edit:" + id);
    let currentPost = {};
    postsArray.forEach(post => {
        if(post.postId == id){
            currentPost = post;
        }
    });
    res.render("editPost.ejs", {currentPost});
})

app.post("/submit-editPost", upload.single('postImagen'), (req, res) => {
    let id = req.query.id; //It's the named that's passed in the URL
    postsArray.forEach(post => {
        if(post.postId == id){
            post.titulo = req.body.postTitulo;
            if(req.file?.filename){
                post.imagen = "images/"+req.file.filename;
            }
            post.contenido = req.body.postContenido;
        }
    });
    res.redirect("/");
} )

app.get("/delete-post", (req, res) => {
    let id = req.query.id; //It's the named that's passed in the URL
    console.log("ID:" + req.query.id);
    let index = postsArray.findIndex((post) => post.postId == id);
    console.log(index);
    if(index !== -1){
        postsArray.splice(index, 1);
    }
    postsArray.forEach(element => {
        console.log(element);
    });
    res.redirect("/")
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})