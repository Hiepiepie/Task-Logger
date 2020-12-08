import 'reflect-metadata';
import {Label} from "../../src/entity/label";
import 'jest';
import request from 'supertest';
import {Helper} from '../helper';
import {Task} from "../../src/entity/task";
// tslint:disable-next-line:no-var-requires
require('dotenv-safe').config();

describe('label', () => {
    const helper = new Helper();

    beforeAll(async () => {
        await helper.init();
    });

    afterAll(async () => {
        await helper.shutdown();
    });
    it('it should be able to create a label', async (done) => {
        await helper.resetDatabase();
        request(helper.app)
            .post('/api/label')
            .send({
                name:"new Label"
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
                expect(res.body.data.name).toBe("new Label");
                expect(res.body.data.createdAt).toBeDefined();
                expect(res.body.data.updatedAt).toBeDefined();
                expect(res.body.data.id).toBeDefined();
                expect(res.body.data.updatedAt).toBe(res.body.data.createdAt);
                done();
            });
    });
    it('it should be able to create a label with a task', async (done) => {
        await helper.resetDatabase();
        request(helper.app)
            .post('/api/label')
            .send({
                name:"new Label",
                tasks:[{
                    name:"task test"
                }]
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
                expect(res.body.data.name).toBe("new Label");
                expect(res.body.data.createdAt).toBeDefined();
                expect(res.body.data.updatedAt).toBeDefined();
                expect(res.body.data.id).toBeDefined();
                expect(res.body.data.updatedAt).toBe(res.body.data.createdAt);
                done();
            });
    });
    it('it should be able to get all labels', async (done) => {
        await helper.resetDatabase();
        const label = new Label();
        label.name = 'Test Label';
        label.tasks = []
        const savedLabel = await helper.getRepo(Label).save(label);
        request(helper.app)
            .get('/api/label')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
                expect(res.body.data.length).toBe(1);
                expect(res.body.data[0].name).toBe(savedLabel.name);
                expect(res.body.data[0].id).toBe(savedLabel.id);
                done();
            });
    });

    it('it should be able to update a label', async (done) => {
        await helper.resetDatabase();
        const label = new Label();
        label.name = 'to be updated Label';
        const savedLabel = await helper.getRepo(Label).save(label);
        request(helper.app)
            .patch(`/api/label/${savedLabel.id}`)
            .send({
                name: 'Edited Name'
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end(async (err, res) => {
                if (err) throw err;
                expect(res.body.data.name).toBe('Edited Name');
                done();
            });
    });
    it('it should be able to get all label by task id', async (done) => {
        await helper.resetDatabase();
        const label1 = new Label();
        const label2 = new Label();
        const task = new Task();
        task.name = "test Task";
        label1.name = 'to be load Label 1';
        label1.tasks = [task];
        label2.name = 'label 2';
        label2.tasks = [task];
        const savedTask = await helper.getRepo(Task).save(task);
        await helper.getRepo(Label).save(label1);
        await helper.getRepo(Label).save(label2);
        request(helper.app)
            .get(`/api/label/filter/${savedTask.id}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end(async (err, res) => {
                if (err) throw err;
                expect(res.body.data.length).toBe(2);
                done();
            });
    });
    it('it should be able to delete a label', async (done) => {
        await helper.resetDatabase();
        const label = new Label();
        const task = new Task();
        task.name = 'To be delete Task';
        await helper.getRepo(Task).save(task);
        label.name = "label to be deleted"
        label.tasks = [task]
        const savedLabel = await helper.getRepo(Label).save(label);
        request(helper.app)
            .delete(`/api/label/${savedLabel.id}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end(async (err) => {
                if (err) throw err;
                const [, labelCount] = await helper.getRepo(Label).findAndCount();
                expect(labelCount).toBe(0);
                done();
            });
    });


})