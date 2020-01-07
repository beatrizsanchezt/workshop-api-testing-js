const agent = require('superagent');
const config = require('config');
const chai = require('chai');
const chaiSubset = require('chai-subset');
const { expect } = require('chai');
const statusCode = require('http-status-codes');

const urlBase = 'https://api.github.com';
const userAgent = '12358-lab';

chai.use(chaiSubset);

let gistCreated;

describe('Given I am an authenticated GitHub user', () => {
  describe('When I create a gist', async () => {
    const newGist = {
      description: 'Example of promises',
      public: true,
      files: {
        'promises.rb': {
          content: `
/* taken from https://javascript.info/promise-basics */

let promise = new Promise(function(resolve, reject) {
  setTimeout(() => resolve("done!"), 1000);
});

// resolve runs the first function in .then
promise.then(
  result => alert(result), // shows "done!" after 1 second
  error => alert(error) // doesn't run
);`
        }
      }
    };
    let response;

    before(async () => {
      response = await agent.post(`${urlBase}/gists`, newGist)
        .auth('token', config.accessToken)
        .set('User-Agent', userAgent);
      gistCreated = response.body;
    });

    it('then the gist should be created properly', async () => {
      expect(response.status).to.equal(statusCode.CREATED);
      expect(gistCreated).to.containSubset(newGist);
    });
  });

  describe('When I query the gist', async () => {
    let response;

    before(async () => {
      response = await agent.get(gistCreated.url)
        .auth('token', config.accessToken)
        .set('User-Agent', userAgent);
    });

    it('then I should receive the gist information', async () => {
      expect(response.status).to.equals(statusCode.OK);
    });
  });

  describe('When I delete the gist', async () => {
    let response;

    before(async () => {
      response = await agent.del(gistCreated.url)
        .auth('token', config.accessToken)
        .set('User-Agent', userAgent);
    });

    it('then the gist should be deleted', async () => {
      expect(response.status).to.equals(statusCode.NO_CONTENT);
    });

    describe('and I query the gist again', async () => {
      let responseStatus;

      before(async () => {
        try {
          response = await agent.get(gistCreated.url)
            .auth('token', config.accessToken)
            .set('User-Agent', userAgent);
        } catch (res) {
          responseStatus = res.status;
        }
      });

      it('then the gist should not exist', async () => {
        expect(responseStatus).to.equals(statusCode.NOT_FOUND);
      });
    });
  });
});
