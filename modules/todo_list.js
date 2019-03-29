let Problem = syzoj.model('problem');
let JudgeState = syzoj.model('judge_state');
let FormattedCode = syzoj.model('formatted_code');
let CustomTest = syzoj.model('custom_test');
let WaitingJudge = syzoj.model('waiting_judge');
let Contest = syzoj.model('contest');
let ProblemTag = syzoj.model('problem_tag');
let ProblemTagMap = syzoj.model('problem_tag_map');
let Article = syzoj.model('article');
let Todo_List = syzoj.model('todo_list');
const Sequelize = require('sequelize');

let Judger = syzoj.lib('judger');
let CodeFormatter = syzoj.lib('code_formatter');

app.get('/todo', async (req, res) => {

  try {
  if (!res.locals.user) throw new ErrorMessage('请登录后继续。', { '登录': syzoj.utils.makeUrl(['login'], { 'url': req.originalUrl }) });
  

  let where = { user_id: res.locals.user.id };
  let paginate = syzoj.utils.paginate(await Todo_List.count(where), req.query.page, syzoj.config.page.problem);
  let todo_lists = await Todo_List.query(paginate, where, [['id', 'desc']]);
  let list={ problems: [] };
  if(todo_lists) {
  for (items of todo_lists)
      {
          let problem = await Problem.fromID(items.problem_id);
          if (problem)
          {
            problem.sourceid = items.id;
            problem.desc = items.desciption;
            list.problems.push(problem);
          }
      }
  }
    let problems = list.problems;
  await problems.forEachAsync(async problem => {
      problem.allowedEdit = await problem.isAllowedEditBy(res.locals.user);
      problem.judge_state = await problem.getJudgeState(res.locals.user, true);
      problem.tags = await problem.getTags();
  });

    res.render('todo', {
      problems: problems,
      paginate: paginate,
    });
  } catch (e) {
    syzoj.log(e);
    res.render('error', {
      err: e
    });
  }
});


app.post('/todo/:id/remove', async (req, res) => {
  try {
		if (!res.locals.user) throw new ErrorMessage('请登录后继续。', { '登录': syzoj.utils.makeUrl(['login'], { 'url': req.originalUrl }) });
    let id = parseInt(req.params.id);
    let todo = await Todo_List.fromID(id);
		if (!todo) throw new ErrorMessage('找不到此条。');
		if(res.locals.user.id !== todo.user_id) throw new ErrorMessage('操作失败。');
    await todo.remove();
    res.redirect(syzoj.utils.makeUrl(['todo']));
  } catch (e) {
    syzoj.log(e);
    res.render('error', {
      err: e
    });
  }
});

app.get('/todo/:id/edit', async (req, res) => {
  try {
		if (!res.locals.user) throw new ErrorMessage('请登录后继续。', { '登录': syzoj.utils.makeUrl(['login'], { 'url': req.originalUrl }) });
    let id = parseInt(req.params.id) || 0;
    let todo_item = await Todo_List.fromID(id);

    if (!todo_item) 
    {
      if(id > 0) throw new ErrorMessage('此ID不存在。');
      todo_item = await Todo_List.create();
      todo_item.id = id;
      todo_item.user_id = res.locals.user.id;

    } else {
      if (res.locals.user.id !== todo_item.user_id) throw new ErrorMessage('您没有权限进行此操作。');
    }
    res.render('todo_edit', {
      todo_list:todo_item
    });
  } catch (e) {
    syzoj.log(e);
    res.render('error', {
      err: e
    });
  }
});

app.post('/todo/:id/edit', async (req, res) => {
  try {
		if (!res.locals.user) throw new ErrorMessage('请登录后继续。', { '登录': syzoj.utils.makeUrl(['login'], { 'url': req.originalUrl }) });
    let id = parseInt(req.params.id) || 0;
    let todo_item = await Todo_List.fromID(id);
    if (!todo_item) 
    {
      todo_item = await Todo_List.create();
      todo_item.user_id = res.locals.user.id;
    }
    if(todo_item.user_id !== res.locals.user.id) throw new ErrorMessage('您没有权限进行此操作。');
    if (req.body.id === null) throw new ErrorMessage('题目名不能为空。');
    let problem_id = parseInt(req.body.pid);

    let problem = await Problem.fromID(problem_id);

    if (!problem) throw new ErrorMessage('Problem doesn\'t exist.');

    todo_item.user_id = res.locals.user.id;
    todo_item.problem_id = problem.id;
    todo_item.desciption = req.body.desciption;
		await todo_item.save();
		
    res.redirect(syzoj.utils.makeUrl(['todo']));
  } catch (e) {
    syzoj.log(e);
    res.render('error', {
      err: e
    });
  }
});


