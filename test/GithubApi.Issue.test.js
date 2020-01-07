const agent = require('superagent');
const config = require('config');
const { expect } = require('chai');

const urlBase = 'https://api.github.com';
const userAgent = '12358-lab';
const newIssue = { title: 'Issue created using POST request' };

let firstRepo;
let userResponse;
let issueResponse;

describe('Given I am an authenticated GitHub user', () => {
  describe('When I request my user information', async () => {
    let response;

    before(async () => {
      response = await agent.get(`${urlBase}/user`)
        .auth('token', config.accessToken)
        .set('User-Agent', userAgent);
      userResponse = response.body;
    });

    it('then I should receive my information', async () => {
      expect(userResponse.public_repos).to.be.above(0);
    });
  });

  describe('When I request my respositories', async () => {
    let response;

    before(async () => {
      response = await agent.get(userResponse.repos_url)
        .auth('token', config.accessToken)
        .set('User-Agent', userAgent);
      firstRepo = response.body.shift();
    });

    it('then I should receive repo information', async () => {
      expect(firstRepo.name).to.not.deep.equals(undefined);
    });
  });

  describe('When I create an issue', async () => {
    let response;

    before(async () => {
      response = await agent.post(`${urlBase}/repos/${userAgent}/${firstRepo.name}/issues`, newIssue)
        .auth('token', config.accessToken)
        .set('User-Agent', userAgent);
      issueResponse = response.body;
    });

    it('then the issue should be created properly', async () => {
      expect(issueResponse.title).to.equals(newIssue.title);
      expect(issueResponse.body).to.deep.equals(null);
    });
  });

  describe('When I add a body to the issue', async () => {
    let response;
    const newBody = { body: 'Body edited using PATH request' };

    before(async () => {
      response = await agent.patch(issueResponse.url, newBody)
        .auth('token', config.accessToken)
        .set('User-Agent', userAgent);
    });

    it('then the issue should be edited properly and the title should not change', async () => {
      expect(response.body.body).to.equals(newBody.body);
      expect(issueResponse.title).to.equals(newIssue.title);
    });
  });
});
