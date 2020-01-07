const agent = require('superagent');
const config = require('config');
const { expect } = require('chai');
const statusCode = require('http-status-codes');

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';
const userAgent = '12358-lab';

describe('Given I am a GitHub user', () => {
  describe('When I follow an user', async () => {
    let response;
    before(async () => {
      response = await agent.put(`${urlBase}/user/following/${githubUserName}`)
        .auth('token', config.accessToken)
        .set('User-Agent', userAgent);
    });

    it('then I should receive a confirmation', async () => {
      expect(response.status).to.equal(statusCode.NO_CONTENT);
      expect(response.body).to.deep.equal({});
    });
  });

  describe('When I send a following request again', async () => {
    let response;
    before(async () => {
      response = await agent.put(`${urlBase}/user/following/${githubUserName}`)
        .auth('token', config.accessToken)
        .set('User-Agent', userAgent);
    });

    it('then I should receive the same confirmation', async () => {
      expect(response.status).to.equal(statusCode.NO_CONTENT);
      expect(response.body).to.deep.equal({});
    });
  });

  describe('When I query the followers', async () => {
    let response;
    before(async () => {
      response = await agent.get(`${urlBase}/users/${githubUserName}/followers`)
        .auth('token', config.accessToken)
        .set('User-Agent', userAgent);
    });

    it('then my user should be on the list', async () => {
      const myUser = response.body.find((user) => user.login === userAgent);
      expect(myUser.login).to.equal(userAgent);
    });
  });
});
