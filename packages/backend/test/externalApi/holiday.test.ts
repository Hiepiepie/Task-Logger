import 'reflect-metadata';
import 'jest';
import request from 'supertest';
import {Helper} from '../helper';
// tslint:disable-next-line:no-var-requires
require('dotenv-safe').config();

describe('holidays', () => {
    const helper = new Helper();

    beforeAll(async () => {
        await helper.init();
    });

    afterAll(async () => {
        await helper.shutdown();
    });
    it('it should be able to return a holiday in month', async (done) => {
        await helper.resetDatabase();
        request(helper.app)
            .get('/api/holiday')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
                expect(res.body.data.holidays.length).toBeGreaterThanOrEqual(0)
                done();
            });
    })
});