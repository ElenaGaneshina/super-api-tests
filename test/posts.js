import supertest from 'supertest';
import {expect} from 'chai';
import {createRandomUser} from "../helper/user_helper";

const request = supertest('https://gorest.co.in/public/v1/');
const TOKEN = '8cf7f6add07523ed7072980320b98c7d9727c6fc5c4ab3a981e45ebff939ef59';

describe('User Posts', () => {
    let postId, userId;

    before(async () => {
      userId =  await createRandomUser();
    });

    it('/posts', async () => {
        const data = {
            user_id: userId,
            title: "My Title",
            body: "My blog post"
        }

        const PostsRes = await request
            .post('posts')
            .set("Authorization", `Bearer ${TOKEN}`)
            .send(data);

        console.log(PostsRes.body);
        expect(PostsRes.body.data).to.deep.include(data);
        postId = PostsRes.body.data.id;
    })

    it('GET .posts/:id', async () => {
        await request
            .get(`posts/${postId}`)
            .set("Authorization", `Bearer ${TOKEN}`)
            .expect(200);
    })
})