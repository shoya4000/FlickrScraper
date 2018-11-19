const account = "/photos/" + process.argv.slice(2) + "/";

var webdriver = require("selenium-webdriver"),
  By = webdriver.By;
let chrome = require("selenium-webdriver/chrome");

async function scrollDown(driver) {
  const css = "a[href^='" + account + "']";
  for (j = 0; j < 3; j++) {
    await driver.sleep(2000).then(function() {
      driver.findElement(By.css(css)).sendKeys(webdriver.Key.END);
    });
  }
}

async function getNumPages(driver) {
  const script =
    "return document.querySelectorAll('a[href^=\"" +
    account +
    "page\"]').length";
  let numPages = 0;
  await driver.executeScript(script).then(pages => {
    numPages = pages - 1;
  });
  return numPages;
}

async function getImages(driver) {
  let images = [];
  await driver
    .executeScript(
      "let photos = document.querySelectorAll('.photo-list-photo-interaction'); let result = []; for(i = 0; i < photos.length; i++){result.push(photos[i].querySelector('a').href)}; return result;"
    )
    .then(result => images.push(result));
  return images[0];
}

async function main() {
  var driver = new webdriver.Builder().forBrowser("chrome").build();

  var pictures = [];
  var numpages = 0;
  await driver.get("https://www.flickr.com" + account);

  numpages = await getNumPages(driver);
  console.log("numpages", numpages);
  await scrollDown(driver);

  pictures = await getImages(driver);
  console.log(pictures.length);

  for (i = 1; i < numpages; i++) {
    console.log("https://www.flickr.com" + account + "page" + (i + 1));
    await driver.get("https://www.flickr.com" + account + "page" + (i + 1));
    await scrollDown(driver);
    pictures = pictures.concat(await getImages(driver));
    console.log(pictures.length);
  }
  for (i = 0; i < pictures.length; i++) {
    console.log("Getting image", i + 1);
    await driver.get(pictures[i] + "sizes/o");
    await driver
      .executeScript(
        "imagediv = document.querySelectorAll('a[href$=\".jpg\"]')[0]; if(imagediv === undefined) imagediv = document.querySelectorAll('a[href$=\".png\"]')[0]; return imagediv.href"
      )
      .then(image => driver.get(image));
  }
}
main();
