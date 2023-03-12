const { findOne, replaceOne } = require('../schema/author');
const authorSchema = require('../schema/author'); //require authorSchema model
const bookSchema = require('../schema/book'); //require bookSchema model
const { IMAGEURL } = require('../config/bootstrap'); //require .config folder to use imageurl in book post 
module.exports = {
    /*@name: RITA 
   @description: author add
   @date: 16/07/2022
   @api param:  Name,description,Country:
   */
    authoradd: (req, callback) => {
        try {
            let author_add = {
                Name: req.body.Name,
                Description: req.body.Description,
                Country: req.body.Country
            };
            console.log('req body', author_add);
            //find author name already exist or not
            authorSchema.findOne({ Name: req.body.Name }, (err, datachcek) => {
                if (err) {
                    console.log('err print for chcek data', err);
                    callback({
                        massage: "somthing went wrong",
                        statuscode: 422,
                        sucess: false,
                        data: {},
                    });
                } else {
                    // console.log('datachcek', datachcek);
                    if (datachcek == null) {
                        //save author details in database
                        new authorSchema(author_add).save((err, data) => {
                            if (err) {
                                console.log('err', err);
                                callback({
                                    massage: "somthing went wrong",
                                    statuscode: 422,
                                    sucess: false,
                                    data: {},
                                });
                            } else {
                                if (data != null) {
                                    callback({
                                        massage: "success",
                                        statuscode: 200,
                                        sucess: true,
                                        data: { data },
                                    })
                                }
                            }
                        })
                    } else {
                        callback({
                            massage: "author name already exist",
                            statuscode: 422,
                            sucess: false,
                            data: {},
                        });
                    }
                }
            })


        } catch (err) {
            callback({
                massage: "somthing went wrong",
                statuscode: 422,
                sucess: false,
                data: {},
            });
        }
    },
    /*@name: RITA 
   @description: book add
   @date: 17/07/2022
   @api param:  Name,Image, Description,Author, Price
   */
    bookadd: (req, callback) => {
        try {
            let takeImage = req.files.Image;
            console.log('imagefile:', takeImage);

            let imagefilename = takeImage.name; //image.png
            console.log('filename', imagefilename)
            let imageArr = imagefilename.split(".");
            console.log('split', imageArr)
            console.log('last element:', imageArr.length - 1);
            let imageExtension = imageArr[imageArr.length - 1]; //imageArr[1]=PNG
            console.log('image name:', imageArr); //[ 'images', 'PNG' ]
            console.log('image extension', imageExtension);      // PNG
            let fileName = `${(Math.random() * 100000)}.${imageExtension}`;
            let sampleImageFile = req.files.Image;

            sampleImageFile.mv(`public/images/${fileName}`, (err) => {
                if (err) {
                    console.log('errors ', err);
                    callback({
                        messsage: 'something went wrong',
                        statuscode: 422,
                        success: false,
                        data: {},
                    })
                } else {

                    let bookData = {
                        Name: req.body.Name,
                        Image: fileName,
                        Description: req.body.Description,
                        Author: req.body.Author,
                        Price: req.body.Price
                    };

                    console.log('bookdataaa', bookData);
                    /*chcek book name already exist or not */
                    bookSchema.findOne({ Name: req.body.Name }, (err, bookdata) => {
                        if (err) {
                            console.log("error", err);
                            callback({
                                messsage: 'something went wrong',
                                statuscode: 422,
                                success: false,
                                data: {},
                            })
                        } else {
                            /*if book name already exist then callback provided */
                            if (bookdata != null) {
                                callback({
                                    messsage: 'book name already exist',
                                    statuscode: 422,
                                    success: false,
                                    data: {},
                                });
                            } else {
                                /*find author data exist or not*/
                                authorSchema.findOne({ _id: req.body.Author }, (err, authordata) => {
                                    if (err) {
                                        console.log('author err', err);
                                        callback({
                                            messsage: 'something went wrong',
                                            statuscode: 422,
                                            success: false,
                                            data: {},
                                        })
                                    } else {
                                        console.log(('author data', authordata));
                                        /*   if author data exist then book data will be saved*/
                                        if (authordata != null) {
                                            /* book data save */
                                            new bookSchema(bookData).save((err, booksavedata) => {
                                                if (err) {
                                                    console.log('book saving err', err);
                                                    callback({
                                                        messsage: 'something went wrong',
                                                        statuscode: 422,
                                                        success: false,
                                                        data: {},
                                                    })
                                                } else {
                                                    console.log('book saving data', booksavedata);
                                                    callback({
                                                        messsage: 'book successfully added',
                                                        statuscode: 200,
                                                        success: true,
                                                        data: {
                                                            booksave: booksavedata,
                                                            booksimageurl: `${IMAGEURL}`
                                                        },
                                                    })
                                                }
                                            })
                                        } else {                        //author not exist so book data not saved
                                            callback({
                                                messsage: 'author not exist',
                                                statuscode: 422,
                                                success: false,
                                                data: {},
                                            })
                                        }
                                    }
                                })



                            }

                        }

                    })
                }
            })


        } catch (err) {
            callback({
                massage: "somthing went wrong",
                statuscode: 422,
                sucess: false,
                data: {},
            });
        }
    },

    /*@name: RITA 
  @description: book edit
  @date: 19/07/2022
  @api param:  Name,Image, Description,Author, Price
  */
    bookedit: (req, callback) => {

        try {
            //chcek req files comes or not from postman
            if (req.files != null) {

                //get extension of image file
                let takeImage = req.files.Image;
                let imagefilename = takeImage.name; //image.png
                console.log('image filename', imagefilename);
                let imageArr = imagefilename.split(".");
                console.log('split', imageArr); //[ 'imagee', 'png' ]
                console.log('last element:', imageArr.length - 1);//1
                let imageExtension = imageArr[imageArr.length - 1]; //imageArr[1]=png
                console.log('image name:', imageArr); //[ 'imagee', 'png' ]
                console.log('image extension', imageExtension);      // png
                let fileName = `${(Math.random() * 1000)}.${imageExtension}`;
                console.log('filename', fileName);
                let sampleImage = req.files.Image;
                //image upload 
                sampleImage.mv(`public/images/${fileName}`, (err) => {
                    if (err) {
                        // console.log('file err', err);
                        callback({
                            massage: "somthing went wrong",
                            statuscode: 422,
                            sucess: false,
                            data: {},
                        });

                    } else {
                        let updateBookInfor = {

                            Name: req.body.Name,
                            Description: req.body.Description,
                            Author: req.body.Author,
                            Image: fileName,
                            Price: req.body.Price

                        };
                        console.log('updatebook obj', updateBookInfor);
                        //find the bookid exist or not from database
                        bookSchema.findOne({ _id: req.body.bookid }, (err, findbook) => {
                            if (err) {
                                console.log('err', err);
                                callback({
                                    massage: "somthing went wrong",
                                    statuscode: 422,
                                    sucess: false,
                                    data: {},
                                });
                            } else {
                                console.log(`findbook`, findbook);
                                if (findbook != null) {
                                    //update the book details with image
                                    bookSchema.updateOne({ _id: req.body.bookid }, updateBookInfor, (err, updatedata) => {
                                        if (err) {
                                            console.log('err', err);
                                            callback({
                                                massage: "somthing went wrong",
                                                statuscode: 422,
                                                sucess: false,
                                                data: {},
                                            });
                                        } else {
                                            console.log('updatedata', updatedata);
                                            callback({
                                                massage: "success",
                                                statuscode: 200,
                                                sucess: true,
                                                data: { updatedata },
                                            });
                                        }
                                    })
                                } else {
                                    callback({
                                        massage: "book not found",
                                        statuscode: 403,
                                        sucess: false,
                                        data: {},
                                    });
                                }
                            }
                        })
                    }
                })
                //if image will not be updated only text will be updated
            } else {
                let updateBookInfo = {

                    Name: req.body.Name,
                    Description: req.body.Description,
                    Author: req.body.Author,
                    Price: req.body.Price

                };
                //find the bookid from database
                bookSchema.findOne({ _id: req.body.bookid }, (err, findbookdata) => {
                    if (err) {
                        callback({
                            massage: "somthing went wrong",
                            statuscode: 422,
                            sucess: false,
                            data: {},
                        });
                        console.log('err', err);

                    } else {
                        console.log(`findbook`, findbookdata);
                        if (findbookdata != null) {
                            bookSchema.findOne({ Author: req.body.Author })
                                .then((authordata) => {
                                    console.log('')
                                    if (authordata.Author != null) {
                                        bookSchema.updateOne({ _id: req.body.bookid }, updateBookInfo, (err, updatedata) => {
                                            if (err) {
                                                console.log('err', err)
                                            } else {
                                                console.log('updatedata', updatedata);
                                                callback({
                                                    massage: "success",
                                                    statuscode: 200,
                                                    sucess: true,
                                                    data: { updatedata },
                                                });
                                            }
                                        })
                                    } else {
                                        callback({
                                            massage: "author not found",
                                            statuscode: 422,
                                            sucess: false,
                                            data: {},
                                        });

                                    }

                                })
                                .catch((err) => {
                                    callback({
                                        massage: "something went wrong...",
                                        statuscode: 422,
                                        sucess: false,
                                        data: {},
                                    });
                                })
                            //update the book detailes without image file

                        } else {
                            callback({
                                massage: "book not found",
                                statuscode: 422,
                                sucess: false,
                                data: {},
                            });
                        }
                    }
                })
            }




        } catch (err) {
            console.log('err catch', err)
            callback({
                massage: "somthing went wrong",
                statuscode: 422,
                sucess: false,
                data: {},
            });
        }
    },

    /*@name: RITA 
  @description:All Books List with Author Info  
  @date: 19/07/2022
  @api param:  search,authorid,price_from,price_to
  */
    getbooks: (req, callback) => {
        try {

            let searchbooks = {
                search: req.body.search,
                authorid: req.body.authorid,
                price_from: req.body.price_from,
                price_to: req.body.price_to
            };
            /*search books according to custom search */
            if (searchbooks.search) {
                bookSchema.find({
                    $or:
                        [{ Name: { $regex: req.body.search, $options: `i` } }, { Description: { $regex: req.body.search, $options: `i` } }]
                })
                    .populate(`Author`, `Name Description Country`)
                    .sort({ createdAt: -1 })
                    .then((searchdata) => {
                        if (searchdata.length > 0) {
                            callback({
                                massage: "success get search data",
                                statuscode: 200,
                                sucess: true,
                                data: { searchdata },
                            });
                        } else {
                            callback({
                                massage: "no data ",
                                statuscode: 422,
                                sucess: false,
                                data: {},
                            });
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            callback({
                                massage: "somthing went wrong",
                                statuscode: 422,
                                sucess: false,
                                data: {},
                            });
                        }
                    })
            } else if (searchbooks.authorid) {
                /* search books according to author */
                bookSchema.find({ Author: req.body.authorid })
                    .populate(`Author`, `Name Description`)
                    .sort({createdAt: -1})
                    .then((authordata) => {
                        if (authordata.length > 0) {
                            callback({
                                massage: "success",
                                statuscode: 200,
                                sucess: true,
                                data: { authordata },
                            });
                        } else {
                            callback({
                                massage: "author data not found",
                                statuscode: 422,
                                sucess: false,
                                data: {},
                            });
                        }
                    })
                    .catch((err) => {

                        console.log('err', err);

                    })
            } else if (searchbooks.price_from && req.body.price_to) {
                /*find books according to  price range */
                bookSchema.find({
                    Price: { $gte: req.body.price_from, $lte: req.body.price_to },
                })
                    .populate(`Author`)
                    .sort({ createdAt: -1 })
                    .then((booksprice) => {
                        if (booksprice.length > 0) {
                            callback({
                                massage: "success",
                                statuscode: 200,
                                sucess: true,
                                data: { booksprice },
                            });
                        }else{
                            callback({
                                massage: "No book exist",
                                statuscode: 422,
                                sucess: false,
                                data: {},
                            });
                        }
                    })
            } else {

                //if req body is not provided
                   bookSchema.find({})
                    .populate({
                        path: `Author`,
                        select: `Name Description Country`
                    })
                    .sort({ createdAt: -1 })
                    .then((booksdata) => {
                        console.log('booksdata', booksdata)
                        if (booksdata.length > 0) {
                            callback({
                                massage: "get all book list with author",
                                statuscode: 200,
                                sucess: true,
                                data: { booksdata },
                            });
                        } else {
                            callback({
                                massage: "books data not found",
                                statuscode: 422,
                                sucess: false,
                                data: {},
                            });
                        }
                    })
                    .catch((err) => {
                        console.log('err for books  data', err);
                        callback({
                            massage: "somthing went wrong",
                            statuscode: 422,
                            sucess: false,
                            data: {},
                        });
                    })
            }

        } catch (err) {
            callback({
                massage: "somthing went wrong",
                statuscode: 422,
                sucess: false,
                data: {},
            });
        }
    },

    /*@name: RITA 
  @description: Lists the number of Authors in each country
  @date: 18/07/2022
  @api param: 
  */
    getauthorscountry: (req, callback) => {
        try {
            //aggregate method used for here to make the country field grouped with counted author
            authorSchema.aggregate([

                {
                    $group: {
                        _id: `$Country`,

                        count_author: { $sum: 1 }
                    },

                },
                {
                    $project: {                      //for making the _id field to Country named,count_author to count_author sum

                        Country: "$_id",
                        count_author: `$count_author`,
                        _id: 0
                    }
                }
            ])
                //get the get different no of country with counted authors
                .then((getauthorcountry) => {
                    console.log('get ', getauthorcountry);

                    callback({
                        massage: "success",
                        statuscode: 200,
                        sucess: true,
                        data: { getauthorcountry },
                    });
                })
                .catch((err) => {
                    console.log('err', err);
                    callback({
                        massage: "somthing went wrong",
                        statuscode: 422,
                        sucess: false,
                        data: {},
                    });
                })


        } catch (err) {
            callback({
                massage: "somthing went wrong",
                statuscode: 422,
                sucess: false,
                data: {},
            });
        }
    },
    /*@name: RITA 
     @description: books delete
     @date: 18/07/2022
     @api param: bookid
     */
    booksdelete: (req, callback) => {
        try {
            bookSchema.findByIdAndDelete({ _id: req.body.bookid }, (err, data) => {
                if (err) {
                    console.log('err');
                    callback({
                        massage: "somthing went wrong",
                        statuscode: 422,
                        sucess: false,
                        data: {},
                    });
                } else {
                    console.log('data', data);
                    if (data != null) {
                        callback({
                            massage: "deleted",
                            statuscode: 200,
                            sucess: true,
                            data: {},
                        });
                    } else {
                        callback({
                            massage: " already deleted",
                            statuscode: 422,
                            sucess: false,
                            data: {},
                        });
                    }
                }
            })




        } catch (err) {
            callback({
                massage: "somthing went wrong",
                statuscode: 422,
                sucess: false,
                data: {},
            });
        }
    },
}
