import {Request, Response} from "express";
import {Task} from "../entity/task";
import {EntityManager, getConnection, getRepository, QueryRunner} from "typeorm";
import {Label} from "../entity/label";

// check if a typed Label already exist and return the found label or create a new label
const checkExistingLabel = async (labelName: string, manager: EntityManager) => {
    const existingLabel = await manager.getRepository(Label).findOne({
        where: {name: labelName},
    });
    const label = new Label();
    label.name = labelName;
    return existingLabel || manager.save(label);
};
/**
 * check if there are already Labels with given name or id in Database, if not then create one
 * @param labels
 * @param queryRunner
 * @return dbLabels the labels to be saved in the database
 */
const checkLabelAvailable = async (labels: Label[], queryRunner: QueryRunner) => {
    const promiseLabels = await Promise.all(
        labels.reduce<Promise<Label | undefined>[]>((prev, label) => {
            if (label.id) {
                prev.push(queryRunner.manager.getRepository(Label).findOne(label.id));
                return prev;
            }
            if (label.name) {
                prev.push(checkExistingLabel(label.name, queryRunner.manager));
                return prev;
            }
            return prev;
        }, []),
    );
    return promiseLabels.filter((label) => label !== undefined) as Label[];
}


/**
 * create a new task
 * @param request : Request
 * @param res : Response
 */
export const createTask = async (request: Request, res: Response) => {
    const {name, description, createAt, updatedAt, trackings, labels} = request.body;
    const typedLabels = labels as Label[];
    let dbLabels: Label[] = [];

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
        if (labels) {
            dbLabels = await checkLabelAvailable(typedLabels, queryRunner);
        }
        let task: Task = new Task();
        task.name = name;
        task.description = description;
        task.createdAt = createAt;
        task.updatedAt = updatedAt;
        trackings ? task.trackings = trackings : task.trackings = [];
        task.labels = dbLabels;
        const taskRepository = await queryRunner.manager.getRepository(Task);
        const createdTask = await taskRepository.save(task);
        await queryRunner.commitTransaction();
        res.send({
            data: createdTask
        });
    } catch (e) {
        console.log(e)
        await queryRunner.rollbackTransaction();
        res.status(500).send(JSON.stringify(e));
    } finally {
        await queryRunner.release();
    }

}
/**
 * list all the tasks
 * @param _
 * @param res
 */
export const getAllTasks = async (_: Request, res: Response) => {
    try {
        const taskRepository = await getRepository(Task);
        const tasks = await taskRepository.find();
        res.send({
            data: tasks
        })
    } catch (e) {
        res.status(404).send({
            status: "Not Found !"
        })
    }
}
/**
 * delete a task with given Id
 * @param request
 * @param res
 */
export const deleteOneTask = async (request: Request, res: Response) => {
    const taskId: any = request.params.taskId
    try {
        const taskRepository = await getRepository(Task);
        let task = await taskRepository.findOneOrFail(taskId).then((task: any) => {
            return task;
        }).catch((e: any) => {
            console.log(e);
            res.status(404).send({
                status: "Task does not exist"
            });
        });
        await taskRepository.remove(task).catch((e: any) => {
            console.log(e)
            res.status(404).send({
                status: "Can not remove Task"
            })
        });
        res.send({
            status: "Task removed"
        })
    } catch (e) {
        console.log(e)
    }
}
/**
 * get a task by the given Id
 * @param request
 * @param res
 */
export const getOneTask = async (request: Request, res: Response) => {
    const taskId: any = request.params.taskId;
    try {
        const taskRepository = await getRepository(Task);
        const task = await taskRepository.findOneOrFail(taskId);
        res.send({
            data: task
        })
    } catch (e) {
        res.status(404).send({
            status: "Not Found !"
        })
    }
}
/**
 * edit a task by the given Id
 * @param request
 * @param res
 */
export const editTask = async (request: Request, res: Response) => {
    const taskId: any = request.params.taskId;
    const {name, description, updatedAt, trackings, labels} = request.body;
    const typedLabels = labels as Label[];
    let dbLabels: Label[] = [];
    try {
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.startTransaction();

        if (labels) {
            dbLabels = await checkLabelAvailable(typedLabels, queryRunner);
        }
        const taskRepository = await queryRunner.manager.getRepository(Task);
        let task = await taskRepository.findOneOrFail(taskId);
        name ? task.name = name : null;
        description ? task.description = description : null;
        trackings ? task.trackings = trackings : null;
        labels ? task.labels = dbLabels : null;
        task.updatedAt = updatedAt
        const editedTask = await taskRepository.save(task);
        await queryRunner.commitTransaction();
        res.send({
            data: editedTask
        })
    } catch (e) {
        res.status(404).send({status: "An error"})
        console.log(e)
    }
}
/**
 * filter all the tasks by a specific label
 * @param request
 * @param res
 */
export const getTasksByLabel = async (request: Request, res: Response) => {
    const labelId: any = request.params.labelId;
    const taskRepository = await getRepository(Task);
    const tasks: Task[] = await taskRepository
        .createQueryBuilder('task')
        .leftJoinAndSelect('task.labels', 'labels')
        .where('labels.id=:id', {id: labelId})
        .getMany();

    try {
        res.send({
            data: tasks
        });
    } catch (e) {
        res.status(404).send({
            status: "Not Found !"
        });
    }
}