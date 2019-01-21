## About the server

The server was made using express.js which runs with node.js. 

## Running the server

### Installing node

The first thing that needs to be done is to install node.js. In order to do that, please go to the node.js website and download the version appropriate for your Operating system (either google it or click this link: https://nodejs.org/en/download/)

### Setting up the server

Before being able to start the server, you need to run the following command inside the directory of where the server is:

```shell
npm install
```

This installs all the dependencies required to run the server.

### Starting the server

Once the server has been installed, open a terminal and change the working directory to where the server is (it should be in the same folder as this file) and execute this command:

```shell
node ./
```

or

```shell
node app.js
```

If you are getting an error saying Cannot find module, try installing express (the only dependency of this project) directly by executing this command:

```shell
npm install express
```



### Accessing the server

This will start a server on the machine you are currently using. You can access this server by typing "localhost" in a browser on the machine you are using or if your computer is on an active directory, you can access it by typing the name of the computer inside your browser.

## Viewing all products

Once the server is running, to view all products, you just request /all from the server. If you are running on localhost, the url will look like so: http://localhost/all

### Viewing only available products

To view only the items that are available, you just add a parameter onlyAvailable in the query string with a value of true. The url will look like: http://localhost/all?onlyAvailable=true

Please note: http://localhost/all and http://localhost/all?onlyAvailable=false are equivalent.

## Viewing only one product

To view only one product, you request /detail with the title in the query string. An example URL would look like:  http://localhost/detail?title=Monitor

## Purchasing a product

To purchase a product, follow the same procedure as viewing a product, but instead of requesting for /detail, you request for /purchase. An example URL would look like: http://localhost/purchase?title=Monitor

If the item is available, the output will be "Thank you for buying 1 {item title}"

If the item is not available the output will be "Sorry, there is no more  {item title} in inventory. Please try again later."

## On Error

### Error reading or writing to products.json

products.json is the data file where all the items are stored. Whenever the system is unable to write or read from it, it undoes when it did and sends a 500 error to the client. The reasoning behind this is that you do not want your client to know why the file is not accessible.

### Item not found

If the system does not find the item the client is looking for, it sends back a simple message saying  "Could not find the product you are looking for." with a 416 status code.

### Products.json

As mentionned earlier, products.json is the data file where all the items are stored. In this file, you have an array of json objects, each of them with three property:

title: the title of the item. Must be unique.

price: the price of the item. Must be a number (may be floating point or regular integer).

inventory_count: the number of items in stock. Must be an integer (cannot be a floating point number)