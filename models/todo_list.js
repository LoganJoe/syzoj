let Sequelize = require('sequelize');
let db = syzoj.db;

let model = db.define('todo_list', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: {
    type: Sequelize.INTEGER,
    references: {
      model: 'user',
      key: 'id'
    }
  },
  problem_id: {
    type: Sequelize.INTEGER,
    references: {
      model: 'problem',
      key: 'id'
    }
  },
  desciption: { type: Sequelize.TEXT }
}, {
  timestamps: false,
  tableName: 'todo_list',
  indexes: [
    {
      fields: ['id']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['problem_id']
    }
  ]
});

let Model = require('./common');
class Todo_List extends Model {
  static async create(val) {
    return Todo_List.fromRecord(Todo_List.model.build(Object.assign({

      user_id: 0,
      problem_id: 0,
      desciption: ''
    }, val)));
  }
  async remove ()
  {
      await db.query('DELETE FROM `todo_list`         WHERE `id`         = ' + this.id);
  }

  getModel() { return model; }
}
Todo_List.model = model;

module.exports = Todo_List;
