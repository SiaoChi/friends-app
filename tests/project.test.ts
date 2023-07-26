import { describe, expect, test, jest } from '@jest/globals';

import { sum, multi } from './sum.js';
// import { getRecommendFriendsById } from '../models/friends.js'
import { getUserProfileTagsData } from '../models/user.js'
import request from 'supertest';
import app, { server } from '../index.js'
import { elasticClient } from '../elasticSearch/search.js';
import { redisClient } from '../models/redisClient.js';
import pool from '../models/databasePool.js';

afterAll(done => {
    server.close()
    elasticClient.close()
    pool.end()
    redisClient.disconnect()
    done();
});


/*
[unit test] scenarios
1/ user id not existed
2/ user id existed
*/


const recommendFriends = [60, 91, 100, 39, 40, 41]

test('fetch recommend friends id=1 with status 200', async () => {
    const data = await getRecommendFriendsById(1)
    expect(data).toStrictEqual(recommendFriends)

})

test('getUserProfileTagsData', async () => {
    const data = await getUserProfileTagsData(1)
    console.log(data);
    expect(data).toMatchObject
})

/*
User Sign in scenario using "super-test"
1/ user login correct info
2/ user login with wrong email
3/ user login with wrong password
*/

describe('user login test', () => {
    it('user login correct info response 200', async function () {
        await request(app)
            .post('/user/signin')
            .set('Accept', 'application/json')
            .send({
                email: 'test@gmail.com',
                password: '1111'
            })
            .expect('Content-Type', /json/)
            .expect(200)
    })


    it('user login with wrong email return 400 and error message', async function () {
        const res = await request(app)
            .post('/user/signin')
            .set('Accept', 'application/json')
            .send({
                email: 'tes22t@gmail.com',
                password: '1111'
            })
        expect(res.statusCode).toBe(400)
        expect(res.text).toMatch('user not exist')

    })


    it('user login with wrong password', async function () {
        const res = await request(app)
            .post('/user/signin')
            .set('Accept', 'application/json')
            .send({
                email: 'test@gmail.com',
                password: '111'
            })
        expect(res.statusCode).toBe(400)
        expect(res.text).toMatch('invalid password')
    })
})

/*
get user profile data
*/

describe('GET /api/v1/user/profile/:id', () => {
    test('response with json', async function () {
        const res = await request(app)
            .get(`/api/v1/user/profile/1`)
            .set('Authorization', `Bearer ${accessToken}`)
        expect(res.statusCode).toBe(200)
    })
})