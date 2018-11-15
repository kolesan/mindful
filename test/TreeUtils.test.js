import * as TreeUtils from '../src/utils/TreeUtils';
import * as utils from './TestUtils';

let entryPoint = {
  name: 1,
  children: [
    { name: 1.1, children: [] },
    { name: 2,
      children: [
        { name: 3,
          children: [
            { name: 4, children: [ { name: 5, children: [] }]},
            { name: 6, children: []},
            { name: 7, children: [
              { name: 8, children: [ {name: 9, children: []} ] },
              { name: 10, children: [] }
            ]}
          ]
        }
      ]
    }
  ]
};

test('flattens a tree using postorder traversing', () => {
  expect(TreeUtils.flatten(entryPoint).map(it => it.name)).toEqual([1.1, 5, 4, 6, 9, 8, 10, 7, 3, 2, 1]);
});
