const db = require('../../configs/database');

const Story = function(story) {
    this.user_id = story.user_id;
    this.truyen_type = story.type;
    this.truyen_name = story.name;
    this.truyen_description = story.description;
    this.truyen_image = story.image;
}

Story.add = (newStory, result) => {
    db.query("INSERT INTO truyen SET ?", newStory, (err, res) => {
        if (err) {
            // err syntax or ...
            console.log("Add error: ", err);
            result(err, null);
            return;
        }
        // add success
        console.log("Add story: ", { id: res.insertId, ...newStory });
        result(null, { id: res.insertId, ...newStory });
    })
}

Story.addCategory = (truyen_id, categorys, result) => {
    let listCategory = categorys.split(",");
    for(let i=0 ; i<listCategory.length ; i++){
        let category_id = parseInt(listCategory[i]);
        db.query(`INSERT INTO truyen_category SET truyen_id='${truyen_id}', category_id='${category_id}'`,
            (err, res) => {
                if (err) {
                    console.log("Add error: ", err);
                    result(err, `Add truyen_category with truyen_id=${truyen_id} and category_id=${category_id}`);
                    return;
                }
                console.log("Add truyen_category: ", { truyen_id, category_id });
                result(null, { truyen_id, category_id });
        })
    }
}

Story.addAuthor = (truyen_id, authors, result) => {
    let listAuthor = authors.split(",");
    for(let i=0 ; i<listAuthor.length ; i++){
        let author_id = parseInt(listAuthor[i]);
        db.query(`INSERT INTO truyen_author SET truyen_id='${truyen_id}', author_id='${author_id}'`,
            (err, res) => {
                if (err) {
                    console.log("Add error: ", err);
                    result(err, `Add truyen_author with truyen_id=${truyen_id} and author_id=${author_id}`);
                    return;
                }
                console.log("Add truyen_author: ", { truyen_id, author_id });
                result(null, { truyen_id, author_id });
        })
    }
}

module.exports = Story;