const express = require('express');
const jwt = require('jsonwebtoken');
const ejs = require('ejs')
const nodemailer = require("nodemailer");
const mongoose = require('mongoose')


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true }))

// const Schema = mongoose.Schema

// const userSchema = new Schema({
//     email:{
//         type:String,
//         required: true
//     },
//     password:{
//         type: String,
//         required: true
//     }
// })

// const UserModel = mongoose.model('user', userSchema)

//mongodb connection
// mongoose.connect('mongodb')
// mongoose.connection
// .once('open', () => console.log('connected to mongodb successfully'))
// .on('error', (error) => console.log(error))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
   res.send('hello world')
  })

  const JWT_SECRET = "capacitybay to the world"

  let user = {
    id: "qudgijfbqifh",
    email: "jenomy16@gmail.com",
    password: "test123",
    confirmed: false
  }

  //routes
app.get('/sign-up', (req, res, next) => {
   res.render('sign-up')
  })


app.post('/sign-up', (req, res, next) => {

   const email = req.body.email
   const id = req.body.id

   //user exist
   if(email !== user.email){
    res.send('user not registered')
    return;
  }
  
  //confirm email check
  if (!user.confirmed) {
    res.send('Please confirm your email to login, confirmation link has been sent to your email')
    //if user exist then we create a one time link valid for 10mins
  const secret = JWT_SECRET + user.password
  const payload = {
    email: user.email,
    id: user.id
  }
  const token = jwt.sign(payload, secret, {expiresIn: '10m'})
  const link = `http://localhost:3000/login/${user.id}/${token}`
  console.log(link)
   
//   let transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: "jenomy32@gmail.com",
//         pass:'fxlltlknvduruyjn'
//     }
// }) 

// let mailOptions = {
//     from: "jenomy32@gmail.com",
//     to: email,
//     subject: '<h2>Reset confirmation Link</h2>',
//     html: `Please click this email to confirm your email: <a href="${link}">${link}</a>`
//  }

//  transporter.sendMail(mailOptions, (err, info)=>{
//     if(err){
//         console.log(err)
//     }else{
//         console.log(`email sent: ${info.response}`)
//     }
//     response.redirect("/")
//  })
  // res.send('password reset link has been sent to your email')
  return;
}

  })



app.get('/login/:id/:token', (req, res, next) => {
   const  {id, token} = req.params

   //verifying the user
   if(id !== user.id){
    res.send('Invalid id')
    return
   }

   const secret = JWT_SECRET + user.password
   try{
    const payload = jwt.verify(token, secret)
    
    // setting the user schema confirmed key to have a value of true
    user.confirmed = true     
    res.render('login', {email: user.email})
   }
   catch(err){
    console.log(err)
    res.send(err.message)
   }
  })
app.post('/login/:id/:token', (req, res, next) => {
    const  {id, token} = req.params;
    const  password = req.body.password
    
    if(id !== user.id){
        res.send('Invalid id')
        return
       }
       //validate valid token
       const secret = JWT_SECRET + user.password
       try{
        const payload = jwt.verify(token, secret)

        
        //find user with payload email and id and update after email verification
        if(user.password = password && user.confirmed){
         
         res.send(user)
        }else{
          res.send('incorrect password, try again with correct password')
        }
       }
       catch(err){
        console.log(err)
        res.send(err.message)
       }

  })


  app.listen(3000, () => console.log('server listening on localhost port 3000'))