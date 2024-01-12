const data = {
  id: '01f817b1-5293-4f68-ab8e-aecf043d581a',
  type: 'START_POINT',
  name: '',
  children: [
    {
      id: '1fb44ce4-cc06-41e5-a526-89ad26f3eacd',
      type: 'BOT_RESPONSE',
      name: 'Welcome message',
      children: [
        {
          id: 'e2eb070c-5baf-40b5-a80d-626d75fbc175',
          type: 'USER_INPUT',
          name: '',
          configured: false,
          children: [],
        },
      ],
    },
    {
      id: '19137146-55f3-4def-a94e-8a337b0a58e4',
      type: 'DEFAULT_FALLBACK',
      name: '',
      children: [
        {
          id: '8ddfec3a-e501-4b75-bd91-4b4fa5a2c0c5',
          type: 'BOT_RESPONSE',
          name: 'Fallback message',
          children: [],
        },
      ],
    },
  ],
};

export default data;
