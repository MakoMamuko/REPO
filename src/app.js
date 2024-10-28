const express = require('express');
const mongoose = require('mongoose');
const Customer = require('./models/customer');
const dotenv = require('dotenv');
const app = express();
const cors = require('cors');

mongoose.set('strictQuery', false);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if(process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const PORT = process.env.PORT || 3000;
const CONNECTION = process.env.CONNECTION;

const json = {
    "name": "Larry Lobster",
    "age": 32.5,
    "gpa": 2.8,
    "fullTime": false,
    "registerDate": {
      "$date": "2024-09-14T09:56:04.567Z"
    },
    "graduationDate": null,
    "courses": [
      "Biology",
      "Chemistry",
      "Calculus"
    ],
    "address": {
      "street": "123 Fake St.",
      "city": "Bikini Bottom",
      "zip": 12345
    }
};

const customer = new Customer({
    name: "Momo", 
    industry: "Porn"
});

app.get('/', (req, res) => {
    res.send('Welcome!');
});

app.get('/api/customers', async (req, res) => {
    try{
        const result = await Customer.find();
        res.send({"customers": result});
    } catch(e){
        res.status(500).json({error: e.message});
    }
});

app.get('/api/customers/:id', async (req, res) => {
    console.log({
        requestParams: req.params,
        requestQuery: req.query
    });
    try{
        const {id: customerId} = req.params;
        console.log(customerId); 
        const customer = await Customer.findById(customerId);
        console.log(customer);
        if(!customer){
            res.status(404).json({error: 'User not found'});
        } else {
            res.json({customer});
        }
    } catch(e){
        res.status(500).json({error: 'Something went wrong'});
    } 
});

app.put('/api/customers/:id', async(req, res) => {
    try {
        const customerId = req.params.id;
        const result = await Customer.replaceOne({_id: customerId}, req.body, {new: true});
        console.log(result);
        res.json({updatedCount: result.modifiedCount});
    } catch (e) {
        res.status(500).json({error: 'Something went wrong'});
    }
});

app.delete('/api/customers/:id', async(req, res) => {
    try {
        const customerId = req.params.id;
        const result = await Customer.deleteOne({_id: customerId});
        res.json({deletedCount: result.deletedCount});
    } catch (e){
        res.ststus(500).json({error: 'Something went wrong'});
    }
});

app.post('/', (req, res) => {
    res.send('This is a post request!')
});

app.post('/api/customers', async (req, res) => {
    console.log(req.body);
    const customer = new Customer(req.body);
    try{
        await customer.save();
        res.status(201).json({customer});
    } catch(e) {
        res.status(400).json({error: e.message});
    }
});

const start = async() => {
    try{
        await mongoose.connect(CONNECTION);

        app.listen(PORT, () => {
            console.log('App listening on port ' + PORT);
        });
    } catch(e){
        console.log(e.message);
    }
};

start();