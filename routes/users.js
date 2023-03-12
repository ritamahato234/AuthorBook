var express = require('express');
var middlewareValidation = require('../middlewares/authorbook'); //import midlleware func folder
var serviceValidation = require('../services/users');//import services func folder
var router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});


/* post author add listing. */
router.post('/authoradd', middlewareValidation.authoradd, (req, res) => {
  serviceValidation.authoradd(req, (result) => {
    res.status(200).send(result);
  });
});

/* post book add listing. */
router.post('/bookadd', middlewareValidation.bookadd, (req, res) => {
  serviceValidation.bookadd(req, (result) => {
    res.status(200).send(result);
  });
});
/*post book edit listing. */
router.post('/bookedit', middlewareValidation.bookedit, (req, res) => {
  serviceValidation.bookedit(req, (result) => {
    res.status(200).send(result);
  });
});

/*get all book list with author listing. */
router.get('/getbooks', (req, res) => {
  serviceValidation.getbooks(req, (result) => { 
    res.status(200).send(result);
  });

});

/*get list no of author in country listing. */
router.get('/getauthorscountry',   (req, res) => {
  serviceValidation.getauthorscountry(req, (result) => { 
    res.status(200).send(result);
  });
})
  /*delete the book listing. */
router.delete('/booksdelete', middlewareValidation.bookdelete,(req, res) => {
  serviceValidation.booksdelete(req, (result) => { 
    res.status(200).send(result);
  });
})
module.exports = router;

