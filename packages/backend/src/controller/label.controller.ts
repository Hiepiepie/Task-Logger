import {Request, Response} from "express";
import {EntityManager, getConnection, getRepository, QueryRunner} from "typeorm";
import {Label} from "../entity/label";
import {Task} from "../entity/task";

/**
 * get al labels in a task
 * @param req
 * @param res
 */
export const getLabelsByTask = async (req: Request, res: Response) => {
    const taskId = req.params.taskId;
    try {
        const labelRepository = await getRepository(Label);
        const labels = await labelRepository
            .createQueryBuilder("label")
            .leftJoinAndSelect("label.tasks", "tasks")
            .where("tasks.id =:id", {id: taskId})
            .getMany();
        labels.length > 0 ? res.send({data: labels}) : res.send({data: "This task has no label"})
    } catch (err) {
        res.status(404).send("Error getting datas")
    }
}
// check if there is a existing task
const checkExistingTask = async (taskName: string, manager: EntityManager) => {
    const existingTask = await manager.getRepository(Task).findOne({
        where: {name: taskName},
    });
    const task = new Task();
    task.name = taskName;
    return existingTask || manager.save(task);
};
/**
 * check if there are already Tasks with given name or id in Database, if not then create one
 * @param tasks
 * @param queryRunner
 * @return dbTasks the tasks to be saved in database
 */
const checkTaskAvailable = async (tasks: Task[], queryRunner: QueryRunner) => {
    const promiseTasks = await Promise.all(
        tasks.reduce<Promise<Task | undefined>[]>((prev, task) => {

            // we control the given task by his Id or his Name, if a task existing so return that one,
            if (task.id) {
                prev.push(queryRunner.manager.getRepository(Task).findOne(task.id));
                return prev;
            }
            // if the given name is not taken, then create a task with that name
            if (task.name) {
                prev.push(checkExistingTask(task.name, queryRunner.manager));
                return prev;
            }
            return prev;
        }, []),
    );
    return promiseTasks.filter((task) => task !== undefined) as Task[];
}
/**
 * create a new Label
 * @param req
 * @param res
 */
export const createLabel = async (req: Request, res: Response) => {
    const {id, name, createAt, updatedAt, tasks} = req.body;
    const typedTasks = tasks as Task[];
    let dbTasks: Task[] = [];

        const connection = await getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            if (tasks) {
                dbTasks = await checkTaskAvailable(typedTasks, queryRunner);
            }
            let label: Label = new Label();
            label.id = id;
            label.name = name;
            label.createdAt = createAt;
            label.updatedAt = updatedAt;
            label.tasks = dbTasks;
            const labelRepository = queryRunner.manager.getRepository(Label);
            const createdLabel = await labelRepository.save(label);
            await queryRunner.commitTransaction();
            res.send({data: createdLabel})

        } catch (e) {
            await queryRunner.rollbackTransaction();
            res.status(500).send(JSON.stringify(e));
        } finally {
            await queryRunner.release();
        }
}
/**
 * delete the given Label
 * @param request
 * @param res
 */
export const deleteOneLabel = async (request: Request, res: Response) => {
    const labelId: any = request.params.labelId
    const labelRepository = await getRepository(Label);
    try {
        let label = await labelRepository.findOneOrFail(labelId).then((label: any) => {
            return label;
        }).catch((e: any) => {
            console.log(e);
            res.status(404).send({
                status: "Label does not exist"
            });
        });
        await labelRepository.remove(label).catch((e: any) => {
            console.log(e)
            res.status(404).send({
                status: "Can not remove Label"
            })
        });
        res.send({
            status: "Label removed",
            data: label
        })
    } catch (e) {
        console.log(e)
        res.status(501).send({status: "Internal Server Error"})
    }
}
/**
 * edit a label
 * @param request
 * @param res
 */
export const editLabel = async (request: Request, res: Response) => {
    const labelId: any = request.params.labelId;
    const {name, updatedAt, tasks} = request.body;
    const typedTasks = tasks as Task[];
    let dbTasks: Task[] = [];
    const connection = await getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
        if (tasks) {
            dbTasks = await checkTaskAvailable(typedTasks, queryRunner);
        }
        const labelRepository = queryRunner.manager.getRepository(Label);
        let label = await labelRepository.findOneOrFail(labelId);
        name ? label.name = name : null;
        label.tasks = dbTasks;
        label.updatedAt = updatedAt;
        const editedLabel = await labelRepository.save(label);
        await queryRunner.commitTransaction();
        res.send({
            data: editedLabel
        });
    } catch (e) {
        res.status(404).send({status: "An error occurred during the process"})
        console.log(e);
    }
}
/**
 * list all the labels
 * @param _
 * @param res
 */
export const getAllLabels = async (_: Request, res: Response) => {
    const labelRepository = await getRepository(Label);
    const labels = await labelRepository.find();
    try {
        res.send({
            data: labels
        })
    } catch (e) {
        res.status(404).send({
            status: "Not Found !"
        })
    }
}
