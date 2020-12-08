import {Router} from "express";
import {createTask, deleteOneTask, editTask, getAllTasks, getOneTask,getTasksByLabel} from "../controller/task.controller";

export const taskRouter = Router({mergeParams: true});

/**
 * Transaction , which create a new Task
 */
taskRouter.post('/', createTask);
/**
 * Transaction , which get all existing Tasks
 */
taskRouter.get('/', getAllTasks);

/**
 * Transaction , which delete a Task, when the task not exist, answer with an error code
 */
taskRouter.delete('/:taskId',deleteOneTask);

/**
 * Transaction , which get a Task, if not exist , answer with an error code
 */
taskRouter.get('/:taskId',getOneTask);
/**
 * Transaction , which edit a Task, if not exist , answer with an error code
 */
taskRouter.patch('/:taskId',editTask)
/**
 * Route for : get all tasks by label id
 */
taskRouter.get('/filter/:labelId', getTasksByLabel);