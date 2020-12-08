import {Request, Response} from "express";
import {Tracking} from "../entity/tracking";
import {getRepository} from "typeorm";

/**
 * create a new Tracking
 * @param req
 * @param res
 */
export const createTracking = async (req: Request, res: Response) => {
    const {id, description, startTime, endTime, createdAt, updatedAt, task} = req.body;
    let track = new Tracking();
    track.id = id;
    track.description = description;
    track.startTime = startTime;
    track.endTime = endTime;
    track.createdAt = createdAt;
    track.updatedAt = updatedAt;
    track.task = task;
    const createdTrack = await getRepository(Tracking).save(track);
    res.send({
        data: createdTrack
    });
}
/**
 * get all trackings in a task
 * @param req
 * @param res
 */
export const getTrackingsByTask = async (req: Request, res: Response) => {
    const taskId = req.params.taskId;
    try {
        const trackings = await getRepository(Tracking)
            .createQueryBuilder("track")
            .leftJoinAndSelect("track.task", "task")
            .where("task.id = :id", {id: taskId})
            .getMany();
        res.send({
            data: trackings
        })
    } catch (e) {
        console.log(e)
        res.status(404).send("An error has occurred")
    }
}
/**
 * delete the given Tracking
 * @param request
 * @param res
 */
export const deleteTracking = async (request: Request, res: Response) => {
    const trackingId: any = request.params.trackingId
    const trackingRepository = await getRepository(Tracking);
    try {
        let track = await trackingRepository.findOneOrFail(trackingId).then((track: any) => {
            return track;
        }).catch((e: any) => {
            console.log(e);
            res.status(404).send({
                status: "Tracking does not exist"
            });
        });
        await trackingRepository.remove(track).catch((e: any) => {
            console.log(e)
            res.status(404).send({
                status: "Can not remove Tracking"
            })
        });
        res.send({
            status: "Tracking removed",
            data: track
        })
    } catch (e) {
        console.log(e)
        res.status(501).send({status: "Internal Server Error"})
    }
}
/**
 * get all trackings from database
 * @param _
 * @param res
 */
export const getAllTrackings = async (_: Request, res: Response) => {
    try {
        const trackings = await getRepository(Tracking).find();
        res.send({
            data: trackings
        })
    } catch (e) {
        console.log(e)
        res.status(404).send("An error has occurred")
    }
}
/**
 * Edit a Tracking
 */
export const editTracking = async (req: Request, res: Response) => {
    let trackId : any = req.params.trackingId;
    const {description,updatedAt,endTime} = req.body;
    try {
        const trackingRepository = await getRepository(Tracking);
        let track = await trackingRepository.findOneOrFail(trackId);
        description ? track.description = description : null;
        track.updatedAt = updatedAt;
        endTime ? track.endTime = endTime : null;
        let updatedTrack = await trackingRepository.save(track);
        res.send({data:updatedTrack})
    }catch (e){
        console.log(e);
        res.status(404).send({status : "Resources not found !"})
    }

}