var sqlite3 = require('sqlite3').verbose()
var db;

exports.connect = function(callback) {
  callback = callback || () => {}

  db = new sqlite3.Database('hilshire.db',
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    function(err) {
      if (err) {
        throw err
      } else
        callback()
    })
    
  return db
}

exports.disconnect = function() {
  db.close()
}

exports.blog = {
  add: createRunFn('INSERT INTO blog VALUES(null, ?, ?, ?, ?);'),
  del: createRunFn('DELETE FROM blog WHERE id = ?;'),
  update: createRunFn('UPDATE blog SET title = ?, content = ?, summary = ? WHERE id = ?;'),
  query: createGetFn('SELECT * FROM blog WHERE id = ?;'),
  queryList: createGetFn('SELECT id, title, summary, time From blog', 'all'),
}

exports.article = {
  add: createRunFn('INSERT INTO article VALUES(null, ?, ?, ?);'),
  del: createRunFn('DELETE FROM article WHERE id = ?;'),
  update: createRunFn('UPDATE article SET title = ?, content = ? WHERE id = ?;'),
  query: createGetFn('SELECT * FROM article WHERE id = ?;'),
  queryList: createGetFn('SELECT id, title, content, time FROM article', 'all')
}

exports.tag = {
  add: createRunFn('INSERT INTO tag VALUES(?, ?);'),
  del: createRunFn('DELETE FROM tag WHERE id = ?;'),
  update: createRunFn('UPDATE tag SET type = ? WHERE id = ?;'),
  query: createGetFn('SELECT * FROM tag WHERE id = ?;'),
  queryByText: createGetFn('SELECT * FROM tag WHERE text = ?'),
  used: createGetFn()
}

exports.blogTag = {
  add: createRunFn('INSERT INTO blog_tag VALUES(?, ?);'),
  del: createRunFn('DELETE FROM blog_tag WHERE blog_id = ?, tag_id = ?;'),
  update: createRunFn('UPDATE blog_tag SET tag_id = ? WHERE blog_id = ?;'),
  queryByProject: createGetFn('SELECT blog_id FROM blog_tag WHERE tag_id = ?;'),
  queryByTag: createGetFn('SELECT blog_id FROM blog_tag WHERE tag_id = ?;'),
}

exports.projectTag = {
  add: createRunFn('INSERT INTO project_tag VALUES(?, ?);'),
  del: createRunFn('DELETE FROM project_tag WHERE project_id = ? AND tag_id = ?;'),
  update: createRunFn('UPDATE project_tag SET tag_id WHERE project_id = ?;'),
  queryByProject: createGetFn('SELECT tag_id FROM project_tag WHERE project_id = ?;'),
  queryByTag: createGetFn('SELECT project_id FROM project_tag WHERE tag_id = ?;'),
}

exports.account = {
  add: createRunFn('INSERT INTO account VALUES(null, ?, ?, ?);'),
  del: createRunFn('DELETE FROM account WHERE id = ?;'),
  updatePassword: createRunFn('UPDATE account SET password = ? WHERE id = ?;'),
  updateType: createRunFn('UPDATE account SET type = ? WHERE id = ?'),
  queryByUsername: createGetFn('SELECT password FROM account WHERE username = ?;')
}

// return a sqlite3 interface function
function createRunFn(sql, method) {
  return function(data, callback) {
    db[method || 'run'](sql, data, callback)
    console.log(sql, data)
  }
}


function createGetFn(sql, method) {
  return function(data, callback) {
    if(Object.prototype.toString.call(data) === '[object Function]') {
        callback = data
        data = undefined
    }
    db[method || 'get'](sql, data, callback)
    console.log(sql, data)
  }
}
