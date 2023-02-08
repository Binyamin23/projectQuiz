const express = require("express");
const { auth } = require("../middlewares/atuh");
const { validateTodo, TodoModel, validateTodoUpdate } = require("../models/todoModel");
const { UserModel } = require("../models/userModel");
const router = express.Router();
// main route 

/*
date,time,title,description,user_id,created_at
*/
router.get("/:id", auth, async (req, res) => {
    // let _id = tokenData._id;
    try {
        let data = await TodoModel.findOne({ user_id: req.tokenData._id, isActive: true })

        if (!data) {
            res.status(404).json({ msg: 'No todos found' })
        }
        res.status(200).json({ todo: data })

    } catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }

})
router.post('/', auth, async (req, res) => {
    let validBody = validateTodo(req.body); //validation the request of Create user
    if (validBody.error) {
        return res.status(400).json({ err_msg: validBody.error.details });
    }
    try {
        const todoObj = req.body;
        todoObj.user_id = req.tokenData._id;
        const todo = new TodoModel(todoObj);
        await todo.save()
        let user = await UserModel.findById(req.tokenData._id);
        user.todos_id.push(todo._id);
        await user.save();
        res.json( todo )
    } catch (err) {
        console.log(err);
        return res.status(500).json({ err_msg: err });
    }

})

router.get("/", auth, async (req, res) => {
    try {
        const todos = await TodoModel.find({ user_id: req.tokenData._id, isActive: true });
        if (!todos.length) {
            return res.status(404).json({ err_msg: "No todos found" });
        }
        res.json( todos );
    } catch (err) {
        console.log(err);
        return res.status(500).json({ err_msg: err });
    }
})

router.get("/archive", auth, async (req, res) => {
    try {
        const todos = await TodoModel.find({ user_id: req.tokenData._id, isActive: false }).sort({ date: -1 })
        if (!todos.length) {
            return res.status(404).json({ err_msg: "No todos found in archive" });
        }
        res.json({ todos });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ err_msg: err });
    }
})


router.put("/archive/:id", auth, async (req, res) => {
    try {
        const todo = await TodoModel.findOne({ _id: req.params.id, user_id: req.tokenData._id });
        if (!todo) {
            return res.status(404).json({ err_msg: "No todo found" });
        }
        if (todo.isActive) {
            todo.isActive = false;
            await todo.save();
            return res.json({ msg: "Todo send to archive", isActive: false });
        } else {
            todo.isActive = true;
            await todo.save();
            return res.json({ msg: "Todo is active", isActive: true });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ err_msg: err });
    }
})

router.delete("/:id", auth, async (req, res) => {
    try {
        const todo = await TodoModel.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ err_msg: "No todo found" });
        }
        //!If you want to delete only one todo from database forever
        const data = await TodoModel.deleteOne({ _id: req.params.id, user_id: req.tokenData._id })
        if (data.deletedCount === 0) {
            return res.status(403).json({ err_msg: "somthing wrong..." });
        }

        return res.json({ msg: "Todo deleted" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ err_msg: err });
    }
})

router.put("/completed/:id", auth, async (req, res) => {
    try {
        const todo = await TodoModel.findOne({ _id: req.params.id, user_id: req.tokenData._id });
        if (!todo) {
            return res.status(404).json({ err_msg: "No todo found" });
        }

        if (!todo.isActive) {
            return res.status(403).json({ err_msg: 'Todo in archive can not change todo complete property', isCompleted: 'error' })
        }

        if (!todo.isCompleted) {
            todo.isCompleted = true;
            await todo.save();
            return res.json({ msg: "Todo is completed", isCompleted: true });
        } else {
            todo.isCompleted = false;
            await todo.save();
            return res.json({ msg: `Todo is isn't completed`, isCompleted: false });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ err_msg: err });
    }
})

router.put('/:id', auth, async (req, res) => {

    let validBody = validateTodoUpdate(req.body); //validation the request of Create user
    if (validBody.error) {
        return res.status(400).json({ err_msg: validBody.error.details });
    }

    try {
        const todo = await TodoModel.findOne({ _id: req.params.id, user_id: req.tokenData._id });
        if (!todo) {
            return res.status(404).json({ err_msg: "No todo found" });
        }
        if (!todo.isActive) {
            return res.status(403).json({ err_msg: 'Todo in archive can not update todo' })
        }

        const data = await TodoModel.updateOne({ _id: req.params.id, user_id: req.tokenData._id }, req.body)
        if (data.modifiedCount != 1) {
            return res.status(403).json({ err_msg: 'do not changed...', update: false });
        }

        const updated = await TodoModel.findById(req.params.id)
        return res.json({ update: true, todo: updated });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ err_msg: err });
    }
})
module.exports = router;