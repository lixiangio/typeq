import { operator, } from 'typeq';

const { $sql } = operator;

export const tasks0 = {
  uid: 6,
  email: "abs@gmail.com",
  keywords: {
    state: false,
    area: `'kkk"k<script\n\t\n
    \t  \b\f    \v 
    type="text/javascript" 
    src="/app.js"></script>`
  },
  list: [
    {
      'state': true,
      'address': [
        {
          name: 'aa',
          admin: "666"
        }
      ],
      'test': {
        a: 1,
        b: 2
      },
    },
    {
      'state': false,
      'address': [
        {
          name: $sql(`now()`)
        },
        {
          name: "bbbb",
          admin: 888
        },
      ],
      'test': {},
    }
  ],
  area: "xx\n\t",
  state: false
};

export const tasks1 = {
  id: 1,
  uid: 6,
  email: 'abs@gmail.com',
  area: '\\6666666666',
  keywords: {
    state: false,
    area: `\\k'k'kk"k<script\n\t type="text/javascript" src="/app.js"></script>`
  },
  list: [
    {
      'state': true,
      'address': [
        {
          name: '111',
          admin: "666"
        }
      ],
      'test': {
        a: 1,
        b: 2
      },
    },
    {
      'state': false,
      'address': [
        {
          name: "X688df"
        },
        {
          name: "pppp",
          admin: 888
        },
      ]
    }
  ],
  state: false
};

export const tasks2 = {
  uid: 6,
  keywords: {
    state: false
  },
  email: 't2@gmail.com',
  list: [],
  area: "xxx",
  state: false
};
