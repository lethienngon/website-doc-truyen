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

function getCategorys(truyen_id) {
    return new Promise(function(resolve, reject){
        db.query(`SELECT c.category_name FROM category c join truyen_category tc 
                on c.category_id=tc.category_id WHERE tc.truyen_id=${truyen_id}`, function (err, res) {
                if (err) {
                    console.log("List categorys error: ", err);
                    reject(err)
                    return;
                }
                let listCategory = '';
                Object.keys(res).forEach(function (key) {
                    listCategory += res[key].category_name + ', ';
                });
                listCategory = listCategory.slice(0, -2);
                resolve(listCategory);
            });
    })
}

function getAuthors(truyen_id) {
    return new Promise(function(resolve, reject){
        db.query(`SELECT a.author_name FROM author a join truyen_author ta
                on a.author_id=ta.author_id WHERE ta.truyen_id=${truyen_id}`, function (err, res) {
                if (err) {
                    console.log("List authors error: ", err);
                    reject(err)
                    return;
                }
                let listAuthor = '';
                Object.keys(res).forEach(function (key) {
                    listAuthor += res[key].author_name + ', ';
                });
                listAuthor = listAuthor.slice(0, -2);
                resolve(listAuthor);
            });
    })
}

Story.getAll = (name, result) => {
    db.query(`SELECT t.*, u.user_name FROM truyen t join user u on t.user_id=u.user_id 
                WHERE truyen_name LIKE '%${name}%'`, async (err, res) => {
        if (err) {
            console.log("Find error: ", err);
            result(err, null);
            return;
        }
        console.log("Story: ", res);
        const listCategory = res.map(async (story) => {
            let categorys = '';
            let authors = '';
            await getCategorys(story.truyen_id)
            .then(function(result){
                categorys = result;
            })
            .catch(function(err){
                console.log("Promise rejection error: "+err);
            })
            await getAuthors(story.truyen_id)
            .then(function(result){
                authors = result;
            })
            .catch(function(err){
                console.log("Promise rejection error: "+err);
            })
            return {
                ...story,
                category_name: categorys,
                author_name: authors
            }
        })
        const data = await Promise.all(listCategory)
        console.log(data);
        result(null, data);
    });
};

Story.delete = (id, result) => {
    db.query("DELETE FROM truyen WHERE truyen_id = ? ", id, (err, res) => {
        if (err) {
            console.log("Deleted error: ", err);
            result(err, null);
            return;
        }
        if (res.affectedRows == 0) {
            console.log("Not found truyen with id: ", id);
            result({ kind: "not_found" }, null);
            return;
        }
        console.log("Deleted truyen with id: ", id);
        result(null, res);
    });
};

module.exports = Story;