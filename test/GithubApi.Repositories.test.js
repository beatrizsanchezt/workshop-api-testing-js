const agent = require('superagent');
const config = require('config');
const { expect } = require('chai');
const chai = require('chai');
const chaiSubset = require('chai-subset');
const fileSystem = require('fs');
const md5 = require('md5');
const path = require('path');

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';
const repoToFind = 'jasmine-awesome-report';
const userAgent = '12358-lab';
const downloadsPath = path.resolve(process.cwd(), config.downloadFolder);
let readmeResponse;

chai.use(chaiSubset);

describe('Given I am a GitHub user', () => {
  describe('When I query another user', () => {
    let userResponse;

    before(async () => {
      const response = await agent.get(`${urlBase}/users/${githubUserName}`)
        .auth('token', config.accessToken)
        .set('User-Agent', userAgent);
      userResponse = response.body;
    });

    it('then I should receive the profile information', async () => {
      expect(userResponse.name).equal('Alejandro Perdomo');
      expect(userResponse.company).equal('PSL');
      expect(userResponse.location).equal('Colombia');
    });
  });

  describe('When I query repositories', () => {
    const description = 'An awesome html report for Jasmine';
    let repoList;

    before(async () => {
      const response = await agent.get(`${urlBase}/users/${githubUserName}/repos`)
        .auth('token', config.accessToken)
        .set('User-Agent', userAgent);
      repoList = response.body;
    });

    it('then I should verify the repo information', async () => {
      const repoFinded = repoList.find((repo) => repo.name === repoToFind);
      if (repoFinded !== 'undefined') {
        expect(repoFinded.full_name).equal(`${githubUserName}/${repoToFind}`);
        expect(repoFinded.private).equal(false);
        expect(repoFinded.description).equal(description);
      }
    });
  });

  describe('when I download a repository', () => {
    const filePath = `${downloadsPath}/repo.zip`;
    before(async () => {
      try {
        await new Promise((resolve) => {
          fileSystem.unlink(filePath, resolve);
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(error);
      }

      const response = await agent.get(`${urlBase}/repos/${githubUserName}/${repoToFind}/zipball`)
        .auth('token', config.accessToken)
        .set('User-Agent', userAgent);

      agent.get(response.redirects.toString())
        .auth('token', config.accessToken)
        .set('User-Agent', userAgent)
        .on('error', (err) => {
          // eslint-disable-next-line no-console
          console.warn(err);
        })
        .pipe(fileSystem.createWriteStream(filePath));
    });

    it('then a zip file should be downloaded', async () => {
      let fileDownloaded = true;
      fileSystem.access(filePath, fileSystem.F_OK, (err) => {
        if (err) {
          fileDownloaded = false;
        }
      });
      expect(fileDownloaded).equal(true);
    });
  });

  describe('When I get the README.md information file', () => {
    const expectedInformation = {
      name: 'README.md',
      path: 'README.md',
      sha: 'b9900ca9b34077fe6a8f2aaa37a173824fa9751d'
    };

    before(async () => {
      const response = await agent.get(`${urlBase}/repos/${githubUserName}/${repoToFind}/readme`)
        .auth('token', config.accessToken)
        .set('User-Agent', userAgent);
      readmeResponse = response.body;
    });

    it('then I should verify the name, path and sha.', async () => {
      expect(readmeResponse).to.containSubset(expectedInformation);
    });
  });

  describe('When I download the README.md file', () => {
    let readmeContent;
    const md5Expected = '0e62b07144b4fa997eedb864ff93e26b';

    before(async () => {
      const response = await agent.get(readmeResponse.download_url)
        .auth('token', config.accessToken)
        .set('User-Agent', userAgent);
      readmeContent = response.text;
    });

    it('then I should verify the md5.', async () => {
      expect(md5(readmeContent)).to.equal(md5Expected);
    });
  });
});
