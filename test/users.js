import supertest from 'supertest';
import {expect} from 'chai';

// const request = supertest('https://gorest.co.in/public/v1/');
const request = supertest('https://gorest.co.in/public-api/');
const TOKEN = '8cf7f6add07523ed7072980320b98c7d9727c6fc5c4ab3a981e45ebff939ef59';

describe('Users', () => {
    xit('GET /users - Console error and response', () => {
        request.get(`users?access-token=${TOKEN}`)
            .end((err, res) => {
                console.log(err);
                console.log(res.body);
            });
    });

    xit('GET /users - Check No Empty Response', (done) => {
        request.get(`users?access-token=${TOKEN}`)
            .end((err, res) => {
                expect(res.body.data).to.not.be.empty;
                done();
            });
    });

    xit('GET /users - Alternative way to handle async calls', () => {
        return request.get(`users?access-token=${TOKEN}`).then((res) => {
            expect(res.body.data).to.not.be.empty;
        });
    });

    xit('GET /users/:id ', () => {
        return request.get(`users/1?access-token=${TOKEN}`).then((res) => {
            expect(res.body.data.id).to.be.eq(1);
        });
    });

    xit('GET /users with query params', () => {
        const url = `users?access-token=${TOKEN}&page=5&gender=female&status=active`;
        return request.get(url).then((res) => {
            expect(res.body.data).to.not.be.empty;
            res.body.data.forEach(data => {
                expect(data.gender).to.eq('female');
                expect(data.status).to.eq('active');
            })
            expect(res.body.meta.pagination.page).to.eq(5);
        });
    });

    xit('POST /users', () => {
        const data = {
            email: `test-${Math.floor(Math.random() * 9999)}@mail.abc`,
            name: `testNameAbc`,
            gender: `male`,
            status: `inactive`
        };
        return request
            .post('users')
            .set("Authorization", `Bearer ${TOKEN}`)
            .send(data)
            .then((res) => {
                console.log(res.body);
                expect(res.body.data.email).to.eq(data.email);
                expect(res.body.data.status).to.eq(data.status);
                expect(res.body.data.gender).to.eq(data.gender);
            })
    });

    xit('POST /users Chai assertions', () => {
        const data = {
            email: `test-${Math.floor(Math.random() * 9999)}@mail.abc`,
            name: `testNameAbc`,
            gender: `male`,
            status: `inactive`
        };
        return request
            .post('users')
            .set("Authorization", `Bearer ${TOKEN}`)
            .send(data)
            .then((res) => {
                expect(res.body.data).to.deep.include(data);
            })
    });

    xit('PUT /users/:id', () => {
        const data = {
            status: 'active',
            name: `Luffy + ${Math.floor(Math.random() * 9999)}`
        }

        return request
            .put('users/132')
            .set('Authorization', `Bearer ${TOKEN}`)
            .send(data)
            .then(res => {
                // console.log(res.body);
                // console.log(res.body.data);
                expect(res.body.data).to.deep.include(data);
            });
    });

    xit('DELETE /users/:id', () => {
        return request
            .delete('users/17')
            .set('Authorization', `Bearer ${TOKEN}`)
            .then((res) => {
                expect(res.body.data).to.be.eq(null);
            })
    });
})