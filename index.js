const fs = require('fs');
const http = require('http');
const url = require('url');
const path = require('path');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

//server

const tempOverview = fs.readFileSync(path.join(__dirname, 'templates', 'template-overview.html'), 'utf-8');
const tempCart = fs.readFileSync(path.join(__dirname, 'templates', 'template-cart.html'), 'utf-8');
const tempProduct = fs.readFileSync(path.join(__dirname, 'templates', 'template-product.html'), 'utf-8');

const data = fs.readFileSync(path.join(__dirname, 'dev-data', 'data.json'), 'utf-8');
const dataObj = JSON.parse(data);
const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //OVERVIEW
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-Type': 'text/html' });

    const cartHtml = dataObj.map(el => replaceTemplate(tempCart, el)).join('');

    const output = tempOverview.replace('{%PRODUCT_CART%}', cartHtml);
    res.end(output);

    //PROUCT PAGE
  } else if (pathname === '/product') {
    const product = dataObj[query.id];

    res.writeHead(200, { 'Content-Type': 'text/html' });

    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    //api
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);
    //page not found
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html'
    });
    res.end('<h1>Page not found</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('listening to on port 8000');
});

////////////////////////////////////////////////////////////////////////////
//files
// const ttin = fs.readFileSync("./txt/output.txt", "utf-8");
// console.log(ttin);

// const txtout = `hi i am arun this what we know about a avocada: ${ttin}./nCreated By${Date.now()}`;

// fs.writeFileSync("./txt/output.txt", txtout);
// console.log("svjv");

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("error");
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);

//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile(`./txt/final.txt`, `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("your completed");
//       });
//     });
//   });
// });
// console.log("will read");

////////////////////////////////////////////////////////////////
