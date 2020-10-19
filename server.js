const express = require('express');
const bodyParser = require('body-parser');
const path  = require('path');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'./index.html'));
})

app.post('/movies',(req,res) => {
    var data;

    async function  getdata(search) {

        let searchurl='https://www.imdb.com/find?q='+search+'&ref_=nv_sr_sm';

        let browser = await puppeteer.launch();
        let page = await browser.newPage();

        await page.goto(searchurl , {waitUntil : 'networkidle2'});

        let movieurl = await page.evaluate(() => {

            let title = document.querySelector('.odd:first-of-type').querySelector('.result_text').querySelector('a').href;
            console.log('title')

            return {
                title
            }

        })

        console.log(movieurl.title);

        page = await browser.newPage();
        await page.goto(movieurl.title,{waitUntil : 'networkidle2'});
        if(movieurl.title[21]==='n') {
            console.log('ohh yeah');
            data = await page.evaluate(() => {

            
                let imageurl = document.querySelector('.image').querySelector('a').querySelector('img').src;
                let work = document.querySelector('.infobar').querySelectorAll('.itemprop');
                let bio = document.querySelector('.inline').innerText;
        
                return {
                    imageurl,
                    work,
                    bio
                }
            })
        }
        else {
            console.log('hello123');
            data = await page.evaluate(() => {

            
                let rating = document.querySelector('.ratingValue').innerText;
                let year = document.querySelector('#titleYear').querySelector('a').innerText;
                // let year='1000';
                let imageurl = document.querySelector('.poster').querySelector('a').querySelector('img').src;
        
                return {
                    imageurl,
                    rating,
                    year
                }
            })
        }

    }



    function hell() {
        let search = req.body.name;
        // res.send({"Hello" : "World"})
        getdata(search).then(() => {
            console.log(data);
            res.send(data);
        }).catch((er) => {
            res.status(400).send("Error");
        }) 
    }


    hell();
});

const port =  5000;

app.listen(port, () => console.log('Server Started on port '+port));
