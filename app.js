const url = require("url");
const fs = require("fs");

const PRODUCTFILE = './data/products.json';

const express = require("express");
const app = express();

const PORT = 80;

let readProducts = (callback) => {
    process.nextTick(()=>{
        fs.readFile(PRODUCTFILE,(err,data) => {
            if (err) {
                callback(err);
            } else {
                callback(err,JSON.parse(data));
            }
        })
    })
}

let filterAvailable = (data,callback) => {
    process.nextTick(
        ()=>{
            callback(null,data.filter((prod)=>prod.inventory_count!=0))
        })
}

let filterByTitle = (data,title,callback) => {
    process.nextTick(
        ()=>{
            callback(null,data.filter((prod)=>prod.title==title))
        })
}

let getAllProducts = (response) => {
    readProducts((err,data)=>{
        if (err) {
            response.sendStatus(500);
        } else {
            response.json(data);
        }
    })
}

let getAvailableProducts = (response) => {
    readProducts((err,data)=>{
        if (err) {
            response.sendStatus(500);
        } else {
            filterAvailable(data, (err,data) => {
                response.json(data);
            })
        }
    })
}

let getOneProduct = (response,title) => {
    readProducts((err,data) => {
        if (err) {
            response.sendStatus(500);
        } else {
            filterByTitle(data, title, (err,data) => {
                if (data.length==1)
                    response.json(data);
                else if (data.length==0)
                    response.status(416).send("Could not find the product you are looking for.");
                else
                    response.sendStatus(500);
            })
        }
    })
}

let buyOneProduct = (response,title) => {
    readProducts((err,data) => {
        if (err) {
            response.sendStatus(500);
        } else {
            let found = false;
            for (let i in data) {
                if (data[i].title == title) {
                    if (!found) {
                        found = true;
                        if (data[i].inventory_count>0) {
                            data[i].inventory_count--;                            
                            fs.writeFile(PRODUCTFILE,JSON.stringify(data),(err) => {
                                if (err) {
                                    response.sendStatus(500);
                                    data[i].inventory_count++; //the system was unable to register that a user bought something, so revert.
                                } else {
                                    response.send(`Thank you for buying 1 ${title}!`);
                                }
                            })
                        } //if
                        else {
                            response.send(`Sorry, there is no more ${title} in inventory. Please try again later.`);
                        }
                    }
                    else {
                        response.sendStatus(500);
                    } //else
                }
            }

            if (!found)
                response.status(416).send("Could not find the product you are looking for.");
        }
    })
}

app.get('/all',(request,response)=>{
    let parsedURL = url.parse(request.url, true);
    //everything
    if (parsedURL.query.onlyAvailable=='false') {
        getAllProducts(response);
    } //if
    //only available    
    else if (parsedURL.query.onlyAvailable=='true') {
        getAvailableProducts(response);
    } //else if
    //if not specified, send everything
    else {
        getAllProducts(response);
    }//else
})//get

app.get('/detail',(request,response)=>{
    let parsedURL = url.parse(request.url, true);
    getOneProduct(response,parsedURL.query.title);
})

app.get('/purchase',(request,response)=>{
    let parsedURL = url.parse(request.url, true);
    buyOneProduct(response,parsedURL.query.title);
})



//Creating the server
app.listen(PORT);

console.log(`Listening on port ${PORT}`);