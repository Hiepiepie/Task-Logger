import {taskRouter} from "./task.router";
import {labelRouter} from "./label.router";
import {trackingRouter} from "./tracking.router";
import {Router} from "express";
import {holidayRouter} from "./holiday.router";

export const globalRouter = Router({mergeParams: true});
globalRouter.use('/label', labelRouter);
globalRouter.use('/task', taskRouter);
globalRouter.use('/tracking', trackingRouter);
globalRouter.use('/holiday', holidayRouter);
