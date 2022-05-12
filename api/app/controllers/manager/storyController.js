const Story = require('../../models/manager/storyModel');
const multer = require('multer');
const path = require('path');

// Config file storage 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images/manager/storys")
    },
    filename: (req, file, cb) => {
        cb(null, 'story_' + Date.now() + path.extname(file.originalname))
    }
})

// Upload Image
const uploadImage = multer({
    storage: storage,
    limits: { fileSize: '10000' },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/
        const mimType = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))

        if (mimType && extname) {
            return cb(null, true)
        }
        cb('Give proper files fomate to upload')
    }
}).single('image');

const addStory = (req, res) => {
    const story = new Story({
        user_id: req.body.user_id,
        type: req.body.type,
        name: req.body.name,
        description: req.body.description,
        image: req.file.path,
    });
    Story.add(story, (err, data) => {
        if (err)
            res.status(500).send({
                state: "error",
                message: "Add story failed!!!"
            });
        else {
            Story.addCategory(data.id, req.body.category, (err, data) => {
                if (err)
                    res.status(500).send({
                        state: "error",
                        message: data
                    })
            })
            Story.addAuthor(data.id, req.body.author, (err, data) => {
                if (err)
                    res.status(500).send({
                        state: "error",
                        message: data
                    })
            })
            res.status(200).send({
                state: "success",
                message: "Add story and truyen_categorys success"
            })
        }
    });
};

module.exports = {
    uploadImage,
    addStory,
}