const Task = require("../models/Task");

// CREATE TASK
const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            status,
            priority,
            dueDate
        } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        const task = await Task.create({
            title,
            description,
            status,
            priority,
            dueDate,
            user: req.user
        });

        res.status(201).json({
            message: "Task created successfully",
            task
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// GET ALL TASKS
const getTasks = async (req, res) => {
    try {

        const tasks = await Task.find({
            user: req.user
        }).sort({
            createdAt: -1
        });

        res.json(tasks);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};


// GET SINGLE TASK
const getTask = async (req, res) => {
    try {

        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json(task);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};


// UPDATE TASK
const updateTask = async (req, res) => {
    try {

        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        task.title =
            req.body.title ?? task.title;

        task.description =
            req.body.description ??
            task.description;

        task.status =
            req.body.status ??
            task.status;

        task.priority =
            req.body.priority ??
            task.priority;

        task.dueDate =
            req.body.dueDate ??
            task.dueDate;

        const updatedTask =
            await task.save();

        res.json({
            message: "Task updated successfully",
            task: updatedTask
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};


// DELETE TASK
const deleteTask = async (req, res) => {
    try {

        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        await task.deleteOne();

        res.json({
            message: "Task deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask
};