import request from "../config/common";
const faker = require('faker');
require ('dotenv').config();

import {expect} from 'chai';
import {createRandomUserWithFaker} from "../helper/user_helper";

const TOKEN = process.env.USER_TOKEN;

describe('User Posts', () => {
    let postId, userId;

    before(async () => {
        userId = await createRandomUserWithFaker();
    });

    it('/posts', async () => {
        const data = {
            user_id: userId,
            title: faker.lorem.sentence(),
            body: faker.lorem.paragraphs()
        }

        const postsRes = await request
            .post('posts')
            .set("Authorization", `Bearer ${TOKEN}`)
            .send(data);

        console.log(data);
        expect(postsRes.body.data).to.deep.include(data);
        postId = postsRes.body.data.id;
    })

    it('GET .posts/:id', async () => {
        await request
            .get(`posts/${postId}`)
            .set("Authorization", `Bearer ${TOKEN}`)
            .expect(200);
    })

    context('Negative Tests', () => {
        it('401 Authentication Failed', async () => {
            const data = {
                user_id: userId,
                title: "My Title",
                body: "My blog post"
            }

            const postsRes = await request
                .post('posts')
                .send(data);
            console.log(postsRes.body);
            expect(postsRes.body.data.message).to.eq("Authentication failed");
        });

        it('422 Validation Fields', async () => {
            const data = {
                user_id: userId,
                title: "My Title"
                //no body
            }

            const postsRes = await request
                .post('posts')
                .set("Authorization", `Bearer ${TOKEN}`)
                .send(data);
            expect(postsRes.body.data[0].field).to.eq("body");
            expect(postsRes.body.data[0].message).to.eq("can't be blank");
            expect(postsRes.body.data[0]).to.not.have.property('message1');
            expect(postsRes.body.data[0]).to.have.property('message').that.is.to.eq("can't be blank");
        });
    })
})