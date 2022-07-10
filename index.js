// axios and cheerio are installed 
const axios = require("axios")
const cheerio = require('cheerio')
require("dotenv").config()
const accountSid = process.env.TWILIO_ACCOUNT_SID 
const authToken = process.env.TWILIO_AUTH_TOKEN
const mobNo = process.env.MOB_NO
const client = require("twilio")(accountSid, authToken);


const url = "https://www.amazon.in/Nike-Black-White-Mystic-RED-Cosmic-DH4245-001/dp/B09DBGL5S9/ref=asc_df_B09DBGL5S9/?tag=googleshopdes-21&linkCode=df0&hvadid=601839624618&hvpos=&hvnetw=g&hvrand=4428395598859854852&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=1007754&hvtargid=pla-1641349174317&psc=1";

const product = {
    name:"",
    price:"",
    link:""
}
// setting interval

const handle = setInterval(scrape, 200000000);

async function scrape(){
    // fetching the data 
    const {data} = await axios.get(url);
    // console.log(data);
    // loading up the html 
    const $ = cheerio.load(data);
    // item to be defined 
    const item = $("div#dp-container");
    // extracting the data we need 
    product.name = $(item).find("h1 span#productTitle").text();
    product.link = url;
    const price = $(item).find("span .a-price-whole").first().text().replace(/[,.]/g, "");
    // console.log(product.name)
    // console.log("Rs"+" "+price)

    const priceNum = parseInt(price);
    product.price = priceNum;
    console.log(product)

    // send an sms 
     //Send an SMS
  if (priceNum < 5000) {
    client.messages
      .create({
        body: `The price of ${product.name} went below ${price}. Purchase it at ${product.link}`,
        from: "+18124583491",
        to: {mobNo},
      })
      .then((message) => {
        console.log(message);
        clearInterval(handle);
      });
    }
}


scrape();