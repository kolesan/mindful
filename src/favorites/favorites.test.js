import favorites from './favorites';

let programs = [
  { timesOpened: 10  },
  { timesOpened: 5   },
  { timesOpened: 1   },
  { timesOpened: 0   },
  { timesOpened: 100 },
  { timesOpened: 78  }
];

it(`returns a provided number of top favorite user programs, in order most used > least used`, () => {
  expect(favorites(programs, 0)).toEqual([]);
  expect(favorites(programs, 1)).toEqual([
    { timesOpened: 100 }
  ]);
  expect(favorites(programs, 2)).toEqual([
    { timesOpened: 100 },
    { timesOpened: 78  }
  ]);
  expect(favorites(programs, 5)).toEqual([
    { timesOpened: 100 },
    { timesOpened: 78  },
    { timesOpened: 10  },
    { timesOpened: 5   },
    { timesOpened: 1   }
  ]);
});

it(`returns empty array if provided programs is not an array or empty array`, () => {
  expect(favorites([], 5)).toEqual([]);
  expect(favorites({}, 5)).toEqual([]);
  expect(favorites("abc", 5)).toEqual([]);
  expect(favorites(25, 5)).toEqual([]);
});

it(`returns empty array if requested number of programs is not a number or is negative`, () => {
  expect(favorites(programs, -1)).toEqual([]);
  expect(favorites(programs, {})).toEqual([]);
  expect(favorites(programs, () => {})).toEqual([]);
});
