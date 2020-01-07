require('es6-promise').polyfill();
const config = require('config');
const isomorphic = require('isomorphic-fetch');
const chai = require('chai');
const chaiSubset = require('chai-subset');
const { expect } = require('chai');
const statusCode = require('http-status-codes');

const header = {
  Authorization: `token ${config.accessToken}`,
  'User-Agent': '12358-lab'
};
const urlBase = 'https://api.github.com';
// const userAgent = '12358-lab';

chai.use(chaiSubset);

let gistCreated;

describe('Given I am an authenticated GitHub user using isomorphic-fetch', () => {
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
      const params = {
        method: 'POST',
        body: JSON.stringify(newGist),
        headers: header
      };

      response = await isomorphic(`${urlBase}/gists`, params);
      gistCreated = await response.json();
    });

    it('then the gist should be created properly', async () => {
      expect(response.status).to.equal(statusCode.CREATED);
      expect(gistCreated).to.containSubset(newGist);
    });

    describe('When I query the gist', async () => {
      before(async () => {
        const params = {
          method: 'GET',
          headers: header
        };
        response = await isomorphic(gistCreated.url, params);
      });

      it('then I should receive the gist information', async () => {
        expect(response.status).to.equals(statusCode.OK);
      });
    });

    describe('When I delete the gist', async () => {
      before(async () => {
        const params = {
          method: 'DELETE',
          headers: header
        };
        response = await isomorphic(gistCreated.url, params);
      });

      it('then the gist should be deleted', async () => {
        expect(response.status).to.equals(statusCode.NO_CONTENT);
      });

      describe('and I query the gist again', async () => {
        before(async () => {
          const params = {
            method: 'GET',
            headers: header
          };
          response = await isomorphic(gistCreated.url, params);
        });

        it('then the gist should not exist', async () => {
          expect(response.status).to.equals(statusCode.NOT_FOUND);
        });
      });
    });
  });
});
