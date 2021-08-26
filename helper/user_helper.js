import supertest from 'supertest';
const request = supertest('https://gorest.co.in/public-api/');
const TOKEN = '8cf7f6add07523ed7072980320b98c7d9727c6fc5c4ab3a981e45ebff939ef59';

export const createRandomUser = async () => {
    const userData = {
        email: `test-${Math.floor(Math.random() * 9999)}@mail.abc`,
        name: `testNameAbc`,
        gender: `male`,
        status: `inactive`
    };
    const res = await request
        .post('users')
        .set("Authorization", `Bearer ${TOKEN}`)
        .send(userData)
    return res.body.data.id;
};