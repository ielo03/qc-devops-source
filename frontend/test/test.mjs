import { expect } from 'chai';
import request from 'supertest';
import { app } from '../src/frontend.mjs';

describe('Frontend', () => {
    it('should respond with the home page', async () => {
        const res = await request(app)
            .get('/')
            .expect('Content-Type', /text\/html/)
            .expect(200);

        expect(res.text).to.contain('Questionable Cocktails');
    });

    it('should respond with the favicon.ico', async () => {
        const res = await request(app)
            .get('/favicon.ico')
            .expect(200);
    });
});