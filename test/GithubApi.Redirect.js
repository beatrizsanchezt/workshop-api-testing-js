const agent = require('superagent');
const config = require('config');
const chai = require('chai');
const chaiSubset = require('chai-subset');
const { expect } = require('chai');
const statusCode = require('http-status-codes');

const githubUserName = 'aperdomob';
const urlBase = 'https://github.com';
const newRepositoryUrl = `${urlBase}/${githubUserName}/new-redirect-test`;
const oldRepositoryUrl = `${urlBase}/${githubUserName}/redirect-test`;
const userAgent = '12358-lab';

chai.use(chaiSubset);


describe('Given I am an authenticated GitHub user', () => {
  describe('When I request the headers for a repository that has been renamed', async () => {
    let response;

    before(async () => {
      try {
        response = await agent.head(oldRepositoryUrl)
          .auth('token', config.accessToken)
          .set('User-Agent', userAgent);
      } catch (res) {
        response = res;
      }
    });

    it('then I should receive a confirmation that has been moved', async () => {
      expect(response.status).to.equal(statusCode.MOVED_PERMANENTLY);
      expect(response.response.headers.location).to.equal(newRepositoryUrl);
    });
  });

  describe('When I request the repo with the GET method', async () => {
    let response;

    before(async () => {
      response = await agent.get(oldRepositoryUrl)
        .auth('token', config.accessToken)
        .set('User-Agent', userAgent);
    });

    it('then it should be redirected to the new Url', async () => {
      expect(response.status).to.equals(statusCode.OK);
      expect(response.redirects[0]).to.equals(newRepositoryUrl);
    });
  });
});
