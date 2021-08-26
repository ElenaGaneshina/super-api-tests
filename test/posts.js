import supertest from 'supertest';
import {expect} from 'chai';
import {createRandomUser} from "../helper/user_helper";

const request = supertest('https://gorest.co.in/public/v1/');
const TOKEN = '8cf7f6add07523ed7072980320b98c7d9727c6fc5c4ab3a981e45ebff939ef59';

describe('User Posts', () => {
    let postId, userId;

    before(async () => {
        userId = await createRandomUser();
    });

    it('/posts', async () => {
        const data = {
            user_id: userId,
            title: "My Title",
            body: "My blog post"
        }

        const postsRes = await request
            .post('posts')
            .set("Authorization", `Bearer ${TOKEN}`)
            .send(data);

        console.log(postsRes.body);
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

        it.only('422 Validation Fields', async () => {
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