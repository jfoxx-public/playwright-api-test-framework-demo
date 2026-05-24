/**
 * == Multiple environment support ==
 *
 * Loads the user registry based on the active environment.
 *
 * The environment is resolved from the `ENV` environment variable.
 * Supported environments: dev, staging, qa, prod.
 *
 * If ENV is missing or invalid, the loader defaults to `qa`.
 *
 * The exported `users` object contains only the users
 * for the resolved environment.
 *
 * @example
 * // Run tests in QA environment
 * ENV=qa npx playwright test
 *
 * @example
 * // Access a specific user
 * import { users } from '@/api/data/users';
 *
 * const qaTest01 = users.test01;
 * console.log(qaTest01.username);
 * console.log(qaTest01.password);
 */
import { users as devUsers } from './users.dev';
import { users as stagingUsers } from './users.staging';
import { users as prodUsers } from './users.prod';
import { users as qaUsers } from './users.qa';

type Environment = 'dev' | 'staging' | 'prod' | 'qa';

const usersForEachEnvironment = {
  dev: devUsers,
  staging: stagingUsers,
  prod: prodUsers,
  qa: qaUsers
};

function resolveEnvironment(): Environment {
  const env = process.env.ENV?.toLowerCase();
    
  if (env === 'dev' || env === 'staging' || env === 'prod' || env === 'qa') {
    return env;
  }
  return 'qa';
}

export const currentEnv = resolveEnvironment();
export const users = usersForEachEnvironment[currentEnv];
