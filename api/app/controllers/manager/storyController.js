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
    limits: { fileSize: '10000' }
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

const findAll = (req, res) => {
    const name = req.query.name;
    Story.getAll(name, (err, data) => {
        if (err)
            res.status(500).send({
                state: "error",
                message: "Some error occurred while retrieving Storys!!!"
            });
        else res.status(200).send(data);
    });
};

const findByStoryID = (req, res) => {
    Story.findId(req.params.storyID, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    state: "warning",
                    message: `Not found Story with id ${req.params.storyID}!`
                });
            } else {
                res.status(500).send({
                    state: "error",
                    message: "Error retrieving Story with id " + req.params.storyID + "!!!"
                });
            }
        } else res.status(200).send(data);
    });
};

const updateStory = (req, res) => {
    let story = {
        truyen_type: req.body.type,
        truyen_status: req.body.status,
        truyen_name: req.body.name,
        truyen_description: req.body.description,
    }
    if(req.file){
        story = {
            ...story,
            truyen_image: req.file.path
        };
    }
    Story.update(req.params.storyID, story, (err, data) => {
        if (err)
            if (err.kind === "not_found") {
                res.status(404).send({
                    state: "warning",
                    message: `Not found Story with id ${req.params.storyID}!`
            });
        } else {
            res.status(500).send({
                state: "error",
                message: "Error update Story with id " + req.params.storyID + "!!!"
            });
        }
        else {
            Story.addCategory(req.params.storyID, req.body.category, (err, data) => {
                if (err)
                    res.status(500).send({
                        state: "error",
                        message: data
                    })
            })
            Story.addAuthor(req.params.storyID, req.body.author, (err, data) => {
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

const deleteStory = (req, res) => {
    Story.delete(req.params.storyID, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    state: "warning",
                    message: `Not found Story with id ${req.params.storyID}!`
                });
            } else {
                res.status(500).send({
                    state: "error",
                    message: "Could not delete Story with id " + req.params.storyID + "!!!"
                });
            }
        } else
            res.send({
                state: "success",
                message: `Story with id ${req.params.storyID} was deleted successfully`
            });
    });
};

module.exports = {
    uploadImage,
    addStory,
    findAll,
    findByStoryID,
    updateStory,
    deleteStory,
}