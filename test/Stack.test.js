import { newEventStack } from '../src/Stack';

test('walks a tree', () => {
  let result = [];
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

  let stack = newEventStack(entryPoint);
  do {
    result.push(stack.head().event.name);
  } while(stack.next());

  expect(result).toEqual([1.1, 5, 4, 6, 9, 8, 10, 7, 3, 2, 1]);
});