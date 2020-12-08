import {Router} from "express";
import {createLabel, deleteOneLabel, editLabel, getAllLabels, getLabelsByTask} from "../controller/label.controller";

export const labelRouter = Router({mergeParams: true});
/**
 * Route for : create a Label
 */
labelRouter.post('/', createLabel);
/**
 * route for : get all Labels of a task
 */
labelRouter.get('/filter/:taskId', getLabelsByTask);
/**
 * route for : get all labels
 */
labelRouter.get('/', getAllLabels);
/**
 * route for : delete a label
 */
labelRouter.delete('/:labelId', deleteOneLabel);
/**
 * route for : edit a label
 */
labelRouter.patch('/:labelId', editLabel)

