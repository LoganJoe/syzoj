# update log for new DTOJ

**new DTOJ based on syzoj, commit b369cfde726fc708e95a6992444ec7aa56846166.**

developed by iftest614, LoganGeo614@gmail.com, 1292382664@qq.com

### user permissions

Add new function:most page are private to unsigned user.

User should sign in and to get the page.

Change: add the following Js statements in the corresponding page file:

```javascript
 if (!res.locals.user) throw new ErrorMessage('请登录后继续。', { '登录': syzoj.utils.makeUrl(['login'], { 'url': req.originalUrl }) });
```

Update location:

```
\web
	\modules
		problem.js
		submission.js
		user.js
		discussion.js
		contest.js
```

And add the sign up passcode:

```
\web
	\views
		sign_up.ejs
```

new two permissions: view_code, view_data

can view code and view data anytime.

```
\web
	\modules
		problem.js
		submission.js
	\models
		judge_state.js
​```		problem.js
		user.js
		user_privilege.js
	\views
		user_edit.ejs
		admin_privilege.ejs
```

New function:ToDo.

```
\web
	\view
        header.ejs
        todo.ejs
        todo_edit.ejs
    \modules
        todo_list.js
    \models
        todo_list.js
```

Assort of contest:

0=unassorted. 1=normal. 2=begin. 3=monographic.

```
\web
    \view
        contests.ejs
    \modules
        contest.js
    \models
    	contest.js

```

problem source: add source tag,add source tab, add source search.

```
\web
    \view
        problems.ejs
        problem.ejs
    \modules
        problem.js
    \models
    	problem.js
```
fixed the BUG #91 
```
\web
    \models
    	rating_calculation.js
```

and some small changes.

TODO:

<del>contest format display（\contests)</del>del>

<del>todo-list.</del>

ranklist after contest

linked to blog

