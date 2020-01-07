const agent = require('superagent');
const config = require('config');
const { expect } = require('chai');
const responseTime = require('superagent-response-time');

const urlBase = 'https://api.github.com';
const userAgent = '12358-lab';
let response;

describe('Given I am an authenticated GitHub user', () => {
  describe('When I try to get all the users', async () => {
    let timeTaken;

    before(async () => {
      try {
        const callback = (req, time) => {
          timeTaken = time;
        };
        response = await agent.get(`${urlBase}/users`)
          .auth('token', config.accessToken)
          .set('User-Agent', userAgent)
          .use(responseTime(callback));
      } catch (res) {
        response = res;
      }
    });

    it('then it should take less than 5 minutes', async () => {
      expect(timeTaken).to.be.below(5000);
    });

    it('and I should receive the first 30 users', () => {
      expect(response.body.length).to.equal(30);
    });
  });

  describe('When I try to get 10 users', async () => {
    before(async () => {
      try {
        response = await agent.get(`${urlBase}/users`)
          .auth('token', config.accessToken)
          .set('User-Agent', userAgent)
          .query({ per_page: 10 });
      } catch (res) {
        response = res;
      }
    });

    it('and I should receive 10 users', () => {
      expect(response.body.length).to.equal(10);
    });
  });

  describe('When I try to get 50 users', async () => {
    before(async () => {
      try {
        response = await agent.get(`${urlBase}/users`)
          .auth('token', config.accessToken)
          .set('User-Agent', userAgent)
          .query({ per_page: 50 });
      } catch (res) {
        response = res;
      }
    });

    it('and I should receive 50 users', () => {
      expect(response.body.length).to.equal(50);
    });
  });
});
