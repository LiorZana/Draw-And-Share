const express = require('express');
const cors = require('cors');
const sharp = require('sharp');
const multer = require('multer');
const fs = require('fs');
const mongoose = require('mongoose');
const UserModel = require('./models/User.model.js');
const LoginModel = require('./models/Login.Model.js');
const { ImageModel, ImageUploadModel } = require('./models/ImageUpload.model.js');
const { PublicImageModel } = require('./models/PublicImage.model');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const dotenv = require('dotenv');
dotenv.config()

const port = process.env.PORT || 80;
const userDb = process.env.USERDB;
mongoose.connect(userDb, { useNewUrlParser: true })
.then(() => console.log('Mongodb connected'))
.catch(err => console.log('db error', err));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, callback) => {
        console.log(file);
        callback(null, file.fieldname + ' ' + Date.now() + '_' + file.originalname)
    }
})

const fileFilter = (req, file, callback) => {
    console.log(file.mimetype)
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        callback(null, true);
    } else {
        callback(null, false);
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter })

const app = express();
app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
    res.send('It is working!');
});

const isValidUserArr = (userArr) => {
    if (userArr.length) {
        return true;
    } else {
        return false;
    }
}

app.post('/signin/', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json('Incorrect form submission.');
    };


    UserModel.find({ email: email.toLowerCase() })
        .exec((err, userInfo) => {
            if (err) {
                console.log('error', err)
                res.status(400).json('UserFetchError')
            } else {
                if (isValidUserArr(userInfo)) {
                    LoginModel.find({ userId: userInfo[0].userId })
                        .exec((err, loginInfo) => {
                            if (err) {
                                res.status(400).json('LoginFetchError');
                            } else {
                                if (loginInfo.length) {
                                    bcrypt.compare(password, loginInfo[0].hash, (err, result) => {
                                        if (err) {
                                            console.log(err)
                                            res.status(400).json('Error retrieveing user')
                                        } else {
                                            if (result) {
                                                res.status(200).json(userInfo)
                                            } else {
                                                res.status(400).json('IncorrectPasswordOrUsername')
                                            }
                                        }
                                    })
                                }

                            }
                        })
                } else {
                    res.status(400).json('UserNotFound');
                }
            }
        })
})



app.post('/register/', (req, res) => {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
        return res.status(400).json('Incorrect form submission')
    }

    const lowerEmail = email.toLowerCase()

    const findIfTaken = async () => {
        const sameUsername = await UserModel.find({ userName: userName }).then()
        const sameEmail = await UserModel.find({ email: lowerEmail }).then();
        if (sameUsername.length && sameEmail.length) {
            return 'userAndEmail';
        } else if (sameUsername.length) {
            return 'user';
        } else if (sameEmail.length) {
            return 'email';
        } else {
            return 'none';
        }
    }

    findIfTaken().then(ifTaken => {
        if (ifTaken === 'userAndEmail') {
            res.status(400).json('emailAndUsernameTaken')
        } else if (ifTaken === 'user') {
            res.status(400).json('usernameTaken')
        } else if (ifTaken === 'email') {
            res.status(400).json('emailTaken')
        } else {
            let highestId = 1;
            UserModel.find({}).sort({ userId: -1 }).limit(1)
                .then(highest => {
                    if (highest.length) {
                        highestId = (highest[0].userId) + 1
                    }
                    UserModel.create({
                        userId: highestId,
                        userName: userName,
                        email: lowerEmail,
                        images: []
                    }, (err, user) => {
                        if (err) {
                            console.log(err)
                            res.status(400).json('Error creating user')
                        } else {
                            bcrypt.genSalt(saltRounds, (err, salt) => {
                                if (err) {
                                    console.log(err)
                                    res.status(400).json('Error creating salt')
                                    return;
                                } else {
                                    bcrypt.hash(password, salt, (err, hash) => {
                                        if (err) {
                                            console.log(err)
                                            res.status(400).json('Error creating hash')
                                            return;
                                        } else {
                                            LoginModel.create({
                                                userId: highestId,
                                                email: lowerEmail,
                                                hash: hash
                                            }, (err, login) => {
                                                if (err) {
                                                    UserModel.remove({ userId: highestId })
                                                    res.status(400).json('Error creating user')
                                                } else {
                                                    ImageUploadModel.create({ userId: highestId }, (err, data) => {
                                                        if (err) {
                                                            UserModel.find({ userId: highestId, }).remove({});
                                                            LoginModel.find({ userId: highestId }).remove({});
                                                            console.log(err)
                                                            res.status(400).json('Error creating user')
                                                        } else if (data.userId) {
                                                            res.status(200).json(user)
                                                        }
                                                    })

                                                }

                                            })


                                        }
                                    })
                                }

                            })

                        }
                    })




                }).catch(console.log)

        }
    })


})




const imageUploadType = upload.single('image');

const writeToFile = async (path, data) => {
    let fileHandle = null;
    try {
        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, '', 'utf8');
        }
    } catch (error) {
        console.log('writeFileSync error:', error)
    }
    try {
        fileHandle = await fs.promises.open(path, mode = 'w');
        await fileHandle.writeFile(data);
    } finally {
        if (fileHandle) {
            await fileHandle.close();
        }
    }
}

const readFileData = async (path) => {
    let fileHandle = null;
    try {
        if (!fs.existsSync(path)) {
            return;
        }
    } catch (error) {
        console.log('exists error:', error);
    }
    try {
        fileHandle = await fs.promises.open(path, mode = 'r');
        const data = await fileHandle.readFile();
        return data;
    } catch (error) {
        console.log('fileread error:', error)
    } finally {
        await fileHandle.close();
    }


}

app.post('/upload/', imageUploadType, (req, res) => {
    const { image, id } = req.body;
    if (!id) {
        res.status(400).json('Error')
        return;
    }
    const svgUploadsPath = `./svgUploads/${id}`;
    const pngConvertionsPath = `./pngConversions/${id}`;
    const svgFile = `USER_${id}_SVG.svg`;
    const pngFile = `USER_${id}_PNG.png`;
    const svgPath = `${svgUploadsPath}/${svgFile}`;
    const pngPath = `${pngConvertionsPath}/${pngFile}`;

    try {
        if (!fs.existsSync(svgUploadsPath)) {
            fs.mkdirSync(svgUploadsPath);
        }
    } catch (error) {
        console.log('mkdir error:', error)
    }
    try {
        if (!fs.existsSync(pngConvertionsPath)) {
            fs.mkdirSync(pngConvertionsPath);
        }
    } catch (error) {
        console.log('mkdir error:', error)
    }

    try {
        writeToFile(svgPath, image).then(() => {
            readFileData(svgPath).then(buffer => {
                sharp(buffer)
                    .png()
                    .toFile(pngPath)
                    .catch(error => console.log('tofile error:', error))
                    .then((info) => {
                        if (info) {
                            fs.readFile(
                                pngPath, 'base64',
                                (err, base64Image) => {
                                    if (err) {
                                        console.log(err);
                                        return;
                                    }
                                    const dataUrl = `data:image/png;base64, ${base64Image}`;
                                    return res.status(201).json(dataUrl)
                                }
                            )
                        } else {
                            console.log('no info')
                        }
                        //fs.unlinkSync(svgPath)
                        //fs.unlinkSync(pngPath)

                    })
                    .catch(err => console.log('sharp error:', err))
            })
        });
    } catch (error) {
        console.log('write error:', error)
    }
})

app.put('/image/', (req, res) => {
    const { image: svgCode, lines, id, public } = req.body;
    if (!svgCode || id === undefined || !lines) {
        res.status(400).json('noImageWasSent')
        return;
    }

    const htmlRegex = /^(<([^>]+)>)+$/g;
    const validHtml = htmlRegex.exec(svgCode)
    if (validHtml) {
        ImageUploadModel.find({ userId: id }).exec((err, userImages) => {
            if (err) {
                console.log(err)
            } else {
                if (userImages.length) {
                    svgToPng(svgCode, id).then(pngBase64 => {
                        const userImageArr = userImages[0].images;
                        const newIndex = userImageArr.length;
                        const dateNow = new Date();
                        const newImage = new ImageModel({
                            imageIndex: newIndex,
                            svgCode: svgCode,
                            linesArray: lines,
                            pngBase64: pngBase64,
                            uploaded: dateNow
                        })
                        userImages[0].updateOne(
                            {
                                $set:
                                {
                                    images: [...userImageArr, newImage]
                                }
                            }, (err, data) => {
                                if (err) {
                                    console.log('error', err)
                                    res.status(400).json('Error uploading image')
                                } else if (public) {
                                    UserModel.find({ userId: id }).exec((err, usersFound) => {
                                        if (err) {
                                            console.log(err)
                                            res.status(400).json('Error finding uploader')
                                        } else if (usersFound.length) {
                                            PublicImageModel.find().then(publicImageArr => {
                                                PublicImageModel.create(
                                                    {
                                                        imageIndex: publicImageArr.length,
                                                        uploader: usersFound[0].userName,
                                                        svgCode: svgCode,
                                                        linesArray: lines,
                                                        pngBase64: pngBase64,
                                                        uploaded: dateNow
                                                    }, (err, data) => {
                                                        if(err){
                                                            console.log(err);
                                                            res.status(400).json('Error uploading to public gallery')
                                                        } else {
                                                            res.status(200).json('Uploaded to public gallery successfully')
                                                        }
                                                    })
                                            })



                                            // PublicImageListModel.find().exec((err, publicImages) => {
                                            //     if (err) {
                                            //         console.log(err)
                                            //     } else {
                                            //         const currentImages = publicImages;
                                            //         console.log(currentImages)
                                            //         const newImage = new PublicImageModel({
                                            //         imageIndex: currentImages.legth,
                                            //         uploader: usersFound[0].userName,
                                            //         svgCode: svgCode,
                                            //         linesArray: lines,
                                            //         pngBase64: pngBase64,
                                            //         uploaded: dateNow
                                            //         })

                                            //     }
                                            // })
                                        }
                                    })

                                } else {
                                    res.status(200).json('we good')
                                }
                            })
                    })

                }

            }
        })
    } else {
        res.status(400).json('error, not a valid html')
    }

})

const svgToPng = async (imageSvg, userId) => {
    try {
        const imagePath = `./galleryUploads/newFile-user${userId}-image.png`;
        const imageBuffer = new Buffer.from(await imageSvg);
        const pngImage = sharp(imageBuffer).png();
        await pngImage.toFile(imagePath);
        const newImage = fs.readFileSync(
            imagePath, 'base64',
            (err, base64Image) => {
                if (err) {
                    console.log(err);
                    return;
                }
                const dataUrl = `data:image/png;base64, ${base64Image}`;
                return dataUrl
            }
        )
        fs.unlinkSync(imagePath);
        return newImage;

    } catch (error) {
        console.log(error);
        return;
    }

}



app.post('/gallery/', (req, res) => {
    const userId = req.body.id;
    if (userId > 0) {
        ImageUploadModel.find({ userId: userId }).exec((err, userUploads) => {
            if (err) {
                console.log(err);
                res.status(400).json('Error fetching images');
                return;
            } else if (userUploads.length) {
                res.status(200).json(JSON.stringify(userUploads[0].images))
            }
        })
    }

})

app.get('/publicimages/', (req, res) => {
    
    PublicImageModel.find().exec((err, publicImages) => {
        if(err){
            console.log(err);
            res.status(400).json('Error fetching public images');
            return;
        } else {
            res.status(200).json(JSON.stringify(publicImages))
        }
    })

})

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});