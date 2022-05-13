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
        db.query(`SELECT c.category_id, c.category_name FROM category c join truyen_category tc 
                on c.category_id=tc.category_id WHERE tc.truyen_id=${truyen_id}`, function (err, res) {
                if (err) {
                    console.log("List categorys error: ", err);
                    reject(err)
                    return;
                }
                let listCategory = '';
                const arrayCategory = [];
                Object.keys(res).forEach(function (key) {
                    listCategory += res[key].category_name + ', ';
                    arrayCategory.push(res[key].category_id)
                });
                listCategory = listCategory.slice(0, -2);
                resolve({
                    listCategory,
                    arrayCategory: arrayCategory
                });
            });
    })
}

function getAuthors(truyen_id) {
    return new Promise(function(resolve, reject){
        db.query(`SELECT a.author_id, a.author_name FROM author a join truyen_author ta
                on a.author_id=ta.author_id WHERE ta.truyen_id=${truyen_id}`, function (err, res) {
                if (err) {
                    console.log("List authors error: ", err);
                    reject(err)
                    return;
                }
                let listAuthor = '';
                const arrayAuthor = [];
                Object.keys(res).forEach(function (key) {
                    listAuthor += res[key].author_name + ', ';
                    arrayAuthor.push(res[key].author_id)
                });
                listAuthor = listAuthor.slice(0, -2);
                resolve({
                    listAuthor,
                    arrayAuthor: arrayAuthor
                });
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
                categorys = result.listCategory;
            })
            .catch(function(err){
                console.log("Promise rejection error: "+err);
            })
            await getAuthors(story.truyen_id)
            .then(function(result){
                authors = result.listAuthor;
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

Story.findId = (id, result) => {
    db.query(`SELECT * FROM truyen WHERE truyen_id = ${id}`, async (err, res) => {
        if (err) {
            console.log("Find by ID error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log("Found story: ", res[0]);
            // result(null, res[0]);
            const listCategory = res.map(async () => {
                let categorys = [];
                let authors = [];
                await getCategorys(id)
                .then(function(result){
                    categorys = result.arrayCategory;
                })
                .catch(function(err){
                    console.log("Promise rejection error: "+err);
                })
                await getAuthors(id)
                .then(function(result){
                    authors = result.arrayAuthor;
                })
                .catch(function(err){
                    console.log("Promise rejection error: "+err);
                })
                return {
                    ...res[0],
                    arrayCategory: categorys,
                    arrayAuthor: authors
                }
            })
            const data = await Promise.all(listCategory);
            console.log(data);
            result(null, data);
            return;
        }
        // not found story with the id
        console.log("Not found story with id: ", id);
        result({ kind: "not_found" }, null);
    });
};

Story.update = (id, story, result) => {
    db.query('UPDATE truyen SET ? WHERE truyen_id = ?',[story, id], (err, res) => {
            if (err) {
                console.log("Updated error: ", err);
                result(err, null);
                return;
            }
            if (res.affectedRows == 0) {
                console.log("Not found story with id: ", id);
                result({ kind: "not_found" }, null);
                return;
            }
            console.log("Updated story: ", { id: id, ...story });
            result(null, { id: id, ...story });
        }
    );
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