import 'reflect-metadata';
import 'jest';
import request from 'supertest';
import {Helper} from '../helper';
import {Task} from "../../src/entity/task";
import {Label} from "../../src/entity/label";
import {Tracking} from "../../src/entity/tracking";
// tslint:disable-next-line:no-var-requires
require('dotenv-safe').config();

describe('task', () => {
    const helper = new Helper();

    beforeAll(async () => {
        await helper.init();
    });

    afterAll(async () => {
        await helper.shutdown();
    });

    it('it should be able to get all tasks', async (done) => {
        await helper.resetDatabase();
        const task = new Task();
        task.name = 'Test Task';
        const savedTask = await helper.getRepo(Task).save(task);
        request(helper.app)
            .get('/api/task')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
                expect(res.body.data.length).toBe(1);
                expect(res.body.data[0].name).toBe(savedTask.name);
                expect(res.body.data[0].id).toBe(savedTask.id);
                done();
            });
    });

    it('it should be able to create a new Task without Labels', async (done) => {
        await helper.resetDatabase();
        request(helper.app)
            .post('/api/task')
            .send({
                description: 'This is a test Task',
                name: 'Test Create Task',
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end((err, res) => {
                if (err) throw err;
                expect(res.body.data.name).toBe('Test Create Task');
                expect(res.body.data.description).toBe('This is a test Task');
                expect(res.body.data.id).toBeDefined();
                expect(res.body.data.createdAt).toBeDefined();
                expect(res.body.data.updatedAt).toBeDefined();
                expect(res.body.data.updatedAt).toBe(res.body.data.createdAt);
                done();
            });
    });
    it('it should be able to create a new Task with a Label', async (done) => {
        await helper.resetDatabase();
        request(helper.app)
            .post('/api/task')
            .send({
                description: 'This is a test Task',
                name: 'Task 1',
                labels: [{
                    name: 'test Label for task 1'
                }]
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end((err, res) => {
                if (err) throw err;
                expect(res.body.data.name).toBe('Task 1');
                expect(res.body.data.description).toBe('This is a test Task');
                expect(res.body.data.id).toBeDefined();
                expect(res.body.data.createdAt).toBeDefined();
                expect(res.body.data.updatedAt).toBeDefined();
                expect(res.body.data.updatedAt).toBe(res.body.data.createdAt);
                expect(res.body.data.labels).toBeDefined();
                expect(res.body.data.labels[0].name).toBe('test Label for task 1');
                done();
            });
    });


    it('it should be able to update a task', async (done) => {
        await helper.resetDatabase();
        const task = new Task();
        task.name = 'To be Updated Task';
        task.description = 'This is a test Task';
        const savedTask = await helper.getRepo(Task).save(task);
        request(helper.app)
            .patch(`/api/task/${savedTask.id}`)
            .send({
                description: 'Edited Description',
                name: 'Edited Name',
                labels: [{
                    name: "added label"
                }],
                trackings: [{
                    description: "added tracking"
                }]
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end(async (err, res) => {
                if (err) throw err;
                expect(res.body.data.name).toBe('Edited Name');
                expect(res.body.data.description).toBe('Edited Description');
                expect(res.body.data.labels[0].name).toBe('added label');
                expect(res.body.data.trackings[0].description).toBe('added tracking');
                done();
            });
    });
    it('it should be able to remove and add some labels and trackings of a task', async (done) => {
        await helper.resetDatabase();
        const task = new Task();
        task.name = 'To be Updated Task';
        task.description = 'This is a test Task';
        let label1= new Label();
        let label2 = new Label();
        label1.name="test1"
        label2.name="test2"
        task.labels = [label1,label2];
        task.trackings = [new Tracking()]
        const savedTask = await helper.getRepo(Task).save(task);
        request(helper.app)
            .patch(`/api/task/${savedTask.id}`)
            .send({
                description: 'Edited Description',
                name: 'Edited Name',
                labels: [{
                    name: "added label"
                }],
                trackings: []
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end(async (err, res) => {
                if (err) throw err;
                expect(res.body.data.name).toBe('Edited Name');
                expect(res.body.data.description).toBe('Edited Description');
                expect(res.body.data.labels.length).toBeLessThan(task.labels.length);
                expect(res.body.data.trackings.length).toBeLessThan(task.trackings.length);
                done();
            });
    });

    it('it should be able to get a single task', async (done) => {
        await helper.resetDatabase();
        const task = new Task();
        task.name = 'to be loaded Task';
        task.description = 'This is a test Task';
        const savedTask = await helper.getRepo(Task).save(task);
        request(helper.app)
            .get(`/api/task/${savedTask.id}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end(async (err, res) => {
                if (err) throw err;
                expect(res.body.data.id).toBe(savedTask.id);
                expect(res.body.data.name).toBe(savedTask.name);
                expect(res.body.data.description).toBe(savedTask.description);
                expect(res.body.data.createdAt).toBeDefined();
                expect(res.body.data.updatedAt).toBeDefined();
                done();
            });
    });

    it('it should be able to filter a all tasks by a label', async (done) => {
        await helper.resetDatabase();
        const label = new Label();
        label.name = "common label";
        const task1 = new Task();
        task1.name = 'Task 1';
        task1.description = 'This is a test Task 1';
        task1.labels = [label]
        const task2 = new Task();
        task2.name = 'Task 2';
        task2.description = 'This is a test Task 2';
        task2.labels = [label]
        const savedLabel = await helper.getRepo(Label).save(label);
        await helper.getRepo(Task).save(task1);
        await helper.getRepo(Task).save(task2);
        request(helper.app)
            .get(`/api/task/filter/${savedLabel.id}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end(async (err, res) => {
                if (err) throw err;
                expect(res.body.data.length).toBe(2);
                expect(res.body.data[0].createdAt).toBeDefined();
                expect(res.body.data[0].updatedAt).toBeDefined();
                expect(res.body.data[1].createdAt).toBeDefined();
                expect(res.body.data[1].updatedAt).toBeDefined();
                done();
            });
    });

    it('it should be able to get a single task', async (done) => {
        await helper.resetDatabase();
        const task = new Task();
        task.name = 'to be loaded Task';
        task.description = 'This is a test Task';
        const savedTask = await helper.getRepo(Task).save(task);
        request(helper.app)
            .get(`/api/task/${savedTask.id}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end(async (err, res) => {
                if (err) throw err;
                expect(res.body.data.id).toBe(savedTask.id);
                expect(res.body.data.name).toBe(savedTask.name);
                expect(res.body.data.description).toBe(savedTask.description);
                expect(res.body.data.createdAt).toBeDefined();
                expect(res.body.data.updatedAt).toBeDefined();
                done();
            });
    });
    it('it should be able to delete a task', async (done) => {
        await helper.resetDatabase();
        const label = new Label();
        const task = new Task();
        task.name = 'To be delete Task';
        task.description = 'This is a test Task';
        label.name = "for deleted task"
        await helper.getRepo(Label).save(label);
        task.labels = [label]
        const savedTask = await helper.getRepo(Task).save(task);
        request(helper.app)
            .delete(`/api/task/${savedTask.id}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end(async (err) => {
                if (err) throw err;
                const [, taskCount] = await helper.getRepo(Task).findAndCount();
                expect(taskCount).toBe(0);
                done();
            });
    });

})