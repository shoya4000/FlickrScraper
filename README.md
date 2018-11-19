# FlickrScraper
Uses a webdriver to download all images from a public Flickr account.  
Avoids having to interact with API, and this also avoids requests being rate-limited, however, is thus a relatively slow process.

Use:  
`npm install selenium-webdriver`  
install chromedriver and add to PATH: https://chromedriver.storage.googleapis.com/index.html?path=2.43/  
In folder run `node flickr_scraper.js [flickr account name]`
