var sqlite3 = require('sqlite3').verbose()
var Q = require('q')

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
}

exports.disconnect = function() {
  db.close()
}

exports.blog = {
  add: createGetFn('INSERT INTO blog VALUES(null, ?, ?, ?);'), 
  del: createRunFn('DELETE FROM blog WHERE id = ?;'),
  update: createRunFn('UPDATE blog SET title = ?, text = ?, type = ? WHERE id = ?;'),
  query: createGetFn('SELECT * FROM blog WHERE id = ?;'),
  queryList: createGetFn('SELECT id, title, type, time From blog'),
}

exports.project = {
  add: createRunFn('INSERT INTO project VALUES(?, ?, ?, ?, ?);'),
  del: createRunFn('DELETE FROM project WHERE id = ?;'),
  update: createRunFn('UPDATE project SET title = ?, describe = ?, address = ?, img = ? WHERE id = ?;'),
  query: createGetFn('SELECT * FROM project WHERE id = ?;')
}

exports.tag = {
  add: createRunFn('INSERT INTO tag VALUES(?, ?);'),
  del: createRunFn('DELETE FROM tag WHERE id = ?;'),
  update: createRunFn('UPDATE tag SET type = ? WHERE id = ?;'),
  query: createGetFn('SELECT * FROM tag WHERE id = ?;')
}

exports.blogTag = {
  add: createRunFn('INSERT INTO blog_tag VALUES(?, ?);'),
  del: createRunFn('DELETE FROM blog_tag WHERE blog_id = ?, tag_id = ?;'),
  update: createRunFn('UPDATE blog_tag SET title = ?, text = ?, type = ? WHERE id = ?;'),
  queryByProject: createGetFn('SELECT * FROM blog_tag WHERE project_id = ?;'),
  queryByTag: createGetFn('SELECT * FROM blog_tag WHERE tag_id = ?;'),
}

exports.projectTag = {
  add: createRunFn('INSERT INTO project_tag VALUES(?, ?);'),
  del: createRunFn('DELETE FROM project_tag WHERE project_id = ? AND tag_id = ?;'),
  update: createRunFn('UPDATE project_tag SET title = ?, text = ?, type = ? WHERE id = ?;'),
  queryByProject: createGetFn('SELECT * FROM project_tag WHERE project_id = ?;'),
  queryByTag: createGetFn('SELECT * FROM project_tag WHERE tag_id = ?;'),
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
    console.log(db)
    db[method || 'run'](sql, data, function(error) {
      if (error) throw error
          else callback()
    })
  }
}

function createGetFn(sql) {
  return function(data, callback) {
    db.get(sql, data, callback)
  }
}
