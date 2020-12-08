import 'reflect-metadata';
import 'jest';
import request from 'supertest';
import {Helper} from '../helper';
import {Tracking} from "../../src/entity/tracking";
import {Task} from "../../src/entity/task";
// tslint:disable-next-line:no-var-requires
require('dotenv-safe').config();

describe('tracking', () => {
    const helper = new Helper();

    beforeAll(async () => {
        await helper.init();
    });

    afterAll(async () => {
        await helper.shutdown();
    });

    it('it should be able to load all tracking', async (done) => {
        await helper.resetDatabase();
        const tracking = new Tracking();
        tracking.description = "test create Tracking";
        const savedTracking = await helper.getRepo(Tracking).save(tracking);
        request(helper.app)
            .get('/api/tracking')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
                expect(res.body.data.length).toBe(1);
                expect(res.body.data[0].description).toBe(savedTracking.description);
                expect(res.body.data[0].id).toBe(savedTracking.id);
                done();
            });
    });

    it('it should be able to edit a tracking', async (done) => {
        await helper.resetDatabase();
        const tracking = new Tracking();
        tracking.description = "test edit Tracking";
        const savedTracking = await helper.getRepo(Tracking).save(tracking);
        request(helper.app)
            .patch(`/api/tracking/${savedTracking.id}`)
            .send({
                description: "edited Tracking"
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end(async (err, res) => {
                if (err) throw err;
                expect(res.body.data.description).toBe("edited Tracking");
                expect(res.body.data.updatedAt).toBeDefined();
                done();
            });
    });
    it('it should be able to get all tracking by task', async (done) => {
        await helper.resetDatabase();
        const task = new Task();
        task.name = "for test";
        const tracking1 = new Tracking();
        tracking1.description = "for test filter 1";
        const tracking2 = new Tracking();
        tracking2.description = "for test filter 2";
        task.trackings = [tracking1, tracking2];
        const savedTask = await helper.getRepo(Task).save(task);
        await helper.getRepo(Tracking).save(tracking1);
        await helper.getRepo(Tracking).save(tracking2);
        request(helper.app)
            .get(`/api/tracking/filter/${savedTask.id}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
                expect(res.body.data.length).toBe(2);
                done();
            });
    });
    it('it should be able to create a tracking', async (done) => {
        await helper.resetDatabase();
        request(helper.app)
            .post('/api/tracking')
            .send({description: 'new tracking'})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
                expect(res.body.data.description).toBe('new tracking');
                done();
            });
    });
    it('it should be able to delete a tracking', async (done) => {
        await helper.resetDatabase();
        const tracking = new Tracking();
        tracking.description = "test delete Tracking";
        const savedTracking = await helper.getRepo(Tracking).save(tracking);
        request(helper.app)
            .delete(`/api/tracking/${savedTracking.id}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end(async (err) => {
                if (err) throw err;
                const [, trackCount] = await helper.getRepo(Tracking).findAndCount();
                expect(trackCount).toBe(0);
                done();
            });
    });
})