import supertest from 'supertest';
import {expect} from 'chai';

// const request = supertest('https://gorest.co.in/public/v1/');
const request = supertest('https://gorest.co.in/public-api/');
const TOKEN = '8cf7f6add07523ed7072980320b98c7d9727c6fc5c4ab3a981e45ebff939ef59';

xdescribe('Users', () => {
    let userId;
    context('POST', () => {
        it('/users', () => {
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
                    userId = res.body.data.id;
                    console.log(userId);
                })
        });
    })

    context('GET', () => {
        it('/users', () => {
            return request.get(`users?access-token=${TOKEN}`).then((res) => {
                expect(res.body.data).to.not.be.empty;
            });
        });

        it('/users/:id ', () => {
            return request.get(`users/${userId}?access-token=${TOKEN}`).then((res) => {
                expect(res.body.data.id).to.be.eq(userId);
            });
        });

        it('/users with query params', () => {
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
    });

    context('PUT', () => {
        it('/users/:id', () => {
            const data = {
                status: 'active',
                name: `Luffy + ${Math.floor(Math.random() * 9999)}`
            }

            return request
                .put(`users/${userId}`)
                .set('Authorization', `Bearer ${TOKEN}`)
                .send(data)
                .then(res => {
                    expect(res.body.data).to.deep.include(data);
                });
        });
    })

    context('DELETE', () => {
        it('/users/:id', () => {
            return request
                .delete(`users/${userId}`)
                .set('Authorization', `Bearer ${TOKEN}`)
                .then((res) => {
                    expect(res.body.data).to.be.eq(null);
                })
        });
    })
})