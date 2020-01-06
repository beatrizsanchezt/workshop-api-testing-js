const agent = require('superagent');
const config = require('config');
const { expect } = require('chai');
const fileSystem = require('fs');
const path = require('path');

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';
const repoToFind = 'jasmine-awesome-report';
const userAgent = '12358-lab';
const downloadsPath = path.resolve(process.cwd(), config.downloadFolder);
const filePath = `${downloadsPath}/repo.zip`;

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
    // let repoResponse;
    before(async () => {
      console.log(filePath);
      console.log(config.downloadFolder);
      console.log(process.cwd());
      try {
        await new Promise((resolve) => {
          fileSystem.unlink(filePath, resolve);
        });
      } catch (error) {
        console.log(error);
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

    it('then ', async () => {
      let fileDownloaded = true;
      fileSystem.access(filePath, fileSystem.F_OK, (err) => {
        if (err) {
          fileDownloaded = false;
        }
      });
      expect(fileDownloaded).equal(true);
    });
  });
});
