const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');

const { expect } = chai;

describe('First Api Tests', () => {
  it('Consume DELETE Service', async () => {
    const data = {
      name: 'Doe',
      age: '35',
      city: 'Nashville'
    };
    const response = await agent.delete('https://httpbin.org/delete').send(data);
    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.json).to.eql(data);
  });

  it('Consume GET Service', async () => {
    const response = await agent.get('https://httpbin.org/ip');
    expect(response.status).to.equal(statusCode.OK);
    expect(response.body).to.have.property('origin');
  });

  it('Consume GET Service with query parameters', async () => {
    const query = {
      name: 'John',
      age: '31',
      city: 'New York'
    };
    const response = await agent.get('https://httpbin.org/get').query(query);
    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.args).to.eql(query);
  });

  it('Consume HEAD Service', async () => {
    const response = await agent.head('https://httpbin.org/headers');
    expect(response.status).to.equal(statusCode.OK);
    expect(response.header).to.have.property('access-control-allow-origin');
    expect(response.body).to.eql({});
  });

  it('Consume PATCH Service', async () => {
    const data = {
      name: 'Doe',
      age: '35',
      city: 'Nashville'
    };
    const response = await agent.patch('https://httpbin.org/patch').send(data);
    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.json).to.eql(data);
  });

  it('Consume PUT Service', async () => {
    const data = {
      name: 'Doe',
      age: '35',
      city: 'Nashville'
    };
    const response = await agent.put('https://httpbin.org/put').send(data);
    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.json).to.eql(data);
  });
});
