/* Připojení modulu frameworku Express */ 
const express = require("express");
/* Připojení externího modulu body-parser (https://www.npmjs.com/package/body-parser) - middleware pro parsování těla požadavku */ 
const bodyParser = require("body-parser"); /* Připojení externího modulu moment (https://momentjs.com/) - knihovna pro formátování datových a časových údajů */ 
const moment = require("moment"); 
const csvtojson = require('csvtojson');
/* Připojení vestavěných modulů fs (práce se soubory) a path (cesty v adresářové struktuře) */ 
const fs = require("fs"); 
const path = require("path");

/* Vytvoření základního objektu serverové aplikace */ 
const app = express();
/* Nastavení portu, na němž bude spuštěný server naslouchat */ 
const port = 3000;

/* Identifikace složky obsahující statické soubory klientské části webu */
app.use(express.static('public'));

/* Nastavení typu šablonovacího engine na pug*/ 
app.set("view engine", "pug"); 
/* Nastavení složky, kde budou umístěny šablony pug */ 
app.set("views", path.join(__dirname, "views"));

const urlencodedParser = bodyParser.urlencoded({extended: false});
app.post('/savedata', urlencodedParser, function(req, res) {
  let date = moment().format('YYYY-MM-DD');
  let str = `"${req.body.tym1}"-"${req.body.tym2}","${req.body.kategorie}","${req.body.odehrani}","${req.body.cas}"\n`;
  console.log(str);
  fs.appendFile(path.join(__dirname, 'data/vysledky.csv'), str, function(err) {
    if (err) {
      console.error(err);
      return res.status(400).json({
        success: false,
        message: "Nastala chyba během ukládání souboru"
      });
    }
    res.redirect(301, '/');
  });          
});


app.get("/todolist", (req, res) => { 
  csvtojson({headers:['tym1','tym2','kategorie','odehrani','cas']}).fromFile(path.join(__dirname, 'data/vysledky.csv')) 
  .then(data => { 
    console.log(data); 
    res.render('index', {nadpis: "Výsledky zápasů", ukoly: data}); 
  }) 
  .catch(err => { 
    console.log(err); 
    res.render('error', {nadpis: "Chyba v aplikaci", chyba: err}); 
  }); 
});

app.listen(port, () => {
  console.log(`Server naslouchá na portu ${port}`);
});