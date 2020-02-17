const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai');
const config = require('config');

const urlBase = 'https://api.github.com';
const githubUserName = '12358-lab';
const repository = 'workshop-api-testing-js';

describe('Github Api Test', () => {
  const repoDesc = 'Workshop Api Testing Js';

  describe('Authentication', () => {
    it('Via OAuth2 Tokens by Header', async () => {
      const response = await agent.get(`${urlBase}/repos/${githubUserName}/${repository}`)
        .auth('token', config.accessToken)
        .set('User-Agent', '12358-lab');
      // console.log(response);
      expect(response.status).to.equal(statusCode.OK);
      expect(response.body.description).equal(repoDesc);
    });

    it('Via OAuth2 Tokens by parameter', async () => {
      const response = await agent.get(`${urlBase}/repos/${githubUserName}/${repository}`)
        .set('User-Agent', 'agent')
        .query(`access_token=${config.accessToken}`);
      expect(response.status).to.equal(statusCode.OK);
      expect(response.body.description).equal(repoDesc);
    });
  });
});
