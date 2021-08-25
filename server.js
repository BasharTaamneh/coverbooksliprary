'use strict';

const express = require('express');
const cors = require('cors');
const server = express();
server.use(cors());
require('dotenv').config();
const PORT = process.env.PORT;
const axios = require('axios')


let inMemory = {}
server.get('/coverBook', gitcoverbook);


function gitcoverbook(req, res) {
    let bookname = req.query.q;
    //http://localhost:3003/coverBook?q={bookname}
    let coverBookURL = `https://openlibrary.org/search.json?q=${bookname}`
    if (inMemory[bookname] !== undefined) {
        console.log(' cache hit , data in cache memory');
        res.send(inMemory[bookname]);
    }

    else {
        console.log(' cache miss , send req to coverBook API');

        try {

            axios.get(coverBookURL).then((coverBookDataResults) => {
                console.log('inside axios');
                // console.log(moviesDataResults.data.results)
                const coverBookDataArray = coverBookDataResults.data.docs.map((item) => {

                    return new coverBookData(item);
                }
                )
                inMemory[bookname] = coverBookDataArray[0];
                res.send(coverBookDataArray[0])
            })
        }
        catch (error) {
            console.log('error from axios', error)
            response.status(404).send(error)
        }
    }
}

class coverBookData {
    constructor(item) {

        if (item.author_name == undefined) {
            this.author_name = 'there is no author'
        }
        else {
            this.author_name = item.author_name[0];

        }

        if (item.isbn == undefined) {

            this.Book_src = `https://i.imgur.com/J5LVHEL.jpeg`;

        }
        else {
            for (let i = 0; i < item.isbn.length; i++) {
                if (item.isbn[i] == undefined) {

                    this.Book_src = `https://covers.openlibrary.org/b/isbn/${item.isbn[i + 1]}-M.jpg`;

                }
                else { this.Book_src = `https://covers.openlibrary.org/b/isbn/${item.isbn[i]}-M.jpg`; }
            }
        }
    }

}

//localhost:3002/test
server.get('/test', (request, response) => {
    response.send('your server is working')
})

server.get('/*', (req, response) => {

    response.status(404).send({ Error_404: "Error 404 This Page NOT FOUND" })
})


server.listen(PORT, () => {
    console.log(`listing on PORT ${PORT}`);
})