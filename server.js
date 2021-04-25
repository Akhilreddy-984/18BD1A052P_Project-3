const express=require('express');
const app=express();
app.use(express.json());
const bodyParser=require('body-parser');
var db;
var s;
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
MongoClient.connect(url,{useUnifiedTopology: true},(err,database)=>{
    if(err) return console.log(err)
    db=database.db("App_data");
    app.listen(5000,()=>{
        console.log('Listening at port 5000');
    })
})

app.set('viewengine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use(express.static('public'))

//home page
app.get('/',(req,res)=>{
    db.collection('Denim').find().toArray((err,result)=>{
        if(err) return console.log(err)
        console.log(result);
        res.render('homepage.ejs',{data:result})
    })
})

app.get('/create',(req,res)=>{
    res.render('add.ejs');
})

app.get('/updatestock',(req,res)=>{
    res.render('update.ejs');
})

app.get('/deleteproduct',(req,res)=>{
    res.render('delete.ejs');
})

app.post('/AddData',(req,res)=>{
    db.collection('Denim').save(req.body,(err,result)=>{
        if(err) console.log(err);
        res.redirect('/')
    })
})
app.post('/delete',(req,res)=>{
    db.collection('Denim').findOneAndDelete({Product_ID:req.body.Product_ID},(err,result)=>{
        if(err) console.log(err)
        res.redirect('/')
    })
})
app.post('/update',(req,res)=>{
    db.collection('Denim').find().toArray((err,result)=>{
        if(err) console.log(err);
        for(var i=0;i<result.length;i++)
        {
            if(result[i].Product_ID==req.body.Product_ID)
            {
                s=result[i].Quantity;
                break;
            }
        }
        db.collection('Denim').findOneAndUpdate({Product_ID:req.body.Product_ID},{
            $set:{Quantity: parseInt(s)+parseInt(req.body.Quantity)}},{sort:{id:-1}},
            (err,result)=>{
                    if(err) return console.log(err)
                    res.redirect("/")
            })
            
    })
    


})