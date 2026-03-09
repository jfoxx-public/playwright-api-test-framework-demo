import type { User } from './user.types';

export const users = {
  admin: {
    username: 'admin',
    password: 'password123',
    roles: ['QA'],
  },
  automation: {
    username: 'automation',
    password: 'autoPass456',
    roles: ['QA'],
  },
} satisfies Record<string, User>;
