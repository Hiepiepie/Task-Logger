import {Router} from "express";
import {createTracking, deleteTracking, getTrackingsByTask,getAllTrackings,editTracking} from "../controller/tracking.controller";

export const trackingRouter = Router({mergeParams: true});
/**
 * Route for : create a new Tracking
 */
trackingRouter.post('/',createTracking);
/**
 * Route for : get all Trackings of the task
 */
trackingRouter.get('/filter/:taskId',getTrackingsByTask);
/**
 * Route for : delete a tracking
 */
trackingRouter.delete('/:trackingId',deleteTracking);
/**
 * Route for : delete a tracking
 */
trackingRouter.patch('/:trackingId',editTracking);
/**
 * Route for : get all Trackings
 */
trackingRouter.get('/',getAllTrackings);