import * as migration_20260920_100744_initial from './20260920_100744_initial';

export const migrations = [
  {
    up: migration_20260920_100744_initial.up,
    down: migration_20260920_100744_initial.down,
    name: '20260920_100744_initial'
  },
];
