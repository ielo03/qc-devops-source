import { expect } from 'chai';
import { generateCocktails } from '../src/questionablecocktails/api/concoct.mjs';
import request from 'supertest';
import { app } from '../src/backend.mjs';

describe('Backend', () => {
    it('should respond with an old fashioned recipe', async () => {
        const res = await generateCocktails('', 'Old Fashioned');

        expect(res).to.be.a('string');
        expect(res).to.contain('Old Fashioned');
        expect(res).to.contain('Ingredients');
        expect(res).to.contain('Instructions');
    });
    it('should respond with a bloody mary recipe', async () => {
        const res = await generateCocktails('', 'Bloody Mary');

        expect(res).to.be.a('string');
        expect(res).to.contain('Bloody Mary');
        expect(res).to.contain('Ingredients');
        expect(res).to.contain('Instructions');
    });
    it('should respond 404', async () => {
        await request(app)
            .get('/api/badpath')
            .expect(404);
    });
});