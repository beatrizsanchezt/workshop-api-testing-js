const listPublicEventsSchema = {
  type: 'object',
  required: ['status', 'body'],
  properties: {
    status: {
      type: 'number',
      enum: [200]
    },
    body: {
      type: 'array',
      items: {
        id: { type: 'string' },
        type: 'object',
        actor: {
          id: { type: 'string' },
          login: { type: 'string' },
          display_login: { type: 'string' },
          gravatar_id: { type: 'string' },
          url: { type: 'string' },
          avatar_url: { type: 'string' }
        },
        repo: {
          id: { type: 'string' },
          name: { type: 'string' },
          url: { type: 'string' }
        },
        payload: {
          push_id: { type: 'string' },
          size: { type: 'number' },
          distinct_size: { type: 'number' },
          ref: { type: ['null', 'string'] },
          head: { type: 'string' },
          before: { type: 'string' },
          commits: [
            {
              sha: { type: 'string' },
              author: {
                email: { type: 'string' },
                name: { type: 'string' }
              },
              message: { type: 'string' },
              distinct: { type: 'boolean' },
              url: { type: 'string' }
            }
          ]
        },
        public: { type: 'boolean' },
        created_at: { type: 'string' }
      }
    }
  }
};

exports.listPublicEventsSchema = listPublicEventsSchema;
