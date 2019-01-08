import * as TreeUtils from '../../src/utils/TreeUtils';
import * as utils from '../TestUtils';
import { log } from "../TestUtils";

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
  expect(TreeUtils.flatten(entryPoint).map(toNames)).toEqual([1.1, 5, 4, 6, 9, 8, 10, 7, 3, 2, 1]);
});

test('Traverses the tree with a path returning iterator', () => {
  let iterator = TreeUtils.pathReturningTreeIterator(entryPoint);

  let first = iterator.next();
  expect(first.value.map(it => it.name)).toEqual([1, 1.1]);
  expect(first.done).toEqual(false);

  expect(iterator.next().value.map(toNames)).toEqual([1, 2, 3, 4, 5]);
  expect(iterator.next().value.map(toNames)).toEqual([1, 2, 3, 4]);
  expect(iterator.next().value.map(toNames)).toEqual([1, 2, 3, 6]);
  expect(iterator.next().value.map(toNames)).toEqual([1, 2, 3, 7, 8, 9]);
  expect(iterator.next().value.map(toNames)).toEqual([1, 2, 3, 7, 8]);
  expect(iterator.next().value.map(toNames)).toEqual([1, 2, 3, 7, 10]);
  expect(iterator.next().value.map(toNames)).toEqual([1, 2, 3, 7]);
  expect(iterator.next().value.map(toNames)).toEqual([1, 2, 3]);
  expect(iterator.next().value.map(toNames)).toEqual([1, 2]);
  expect(iterator.next().value.map(toNames)).toEqual([1]);

  let last = iterator.next();
  expect(last.value).toBeUndefined();
  expect(last.done).toEqual(true);

  iterator.return();
});

test('pathReturningTreeIterable returns an iterable for provided tree', () => {
  let iterable = TreeUtils.pathReturningTreeIterable(entryPoint);
  let iteratorA = iterable[Symbol.iterator]();
  let iteratorB = iterable[Symbol.iterator]();

  let a = iteratorA.next();
  expect(a.value.map(it => it.name)).toEqual([1, 1.1]);
  expect(a.done).toEqual(false);
  expect(iteratorA.next().value.map(toNames)).toEqual([1, 2, 3, 4, 5]);
  expect(iteratorA.next().value.map(toNames)).toEqual([1, 2, 3, 4]);


  let b = iteratorB.next();
  expect(b.value.map(it => it.name)).toEqual([1, 1.1]);
  expect(b.done).toEqual(false);
  expect(iteratorB.next().value.map(toNames)).toEqual([1, 2, 3, 4, 5]);
  expect(iteratorB.next().value.map(toNames)).toEqual([1, 2, 3, 4]);


  expect(iteratorA.next().value.map(toNames)).toEqual([1, 2, 3, 6]);
  expect(iteratorB.next().value.map(toNames)).toEqual([1, 2, 3, 6]);


  let iteratorC = iterable[Symbol.iterator]();
  expect(iteratorC.next().value.map(toNames)).toEqual([1, 1.1]);
});

test("Can map a tree", () => {
  let addAToName = it => Object.assign({}, it, {name: it.name + "a"});
  expect(TreeUtils.map(entryPoint, addAToName)).toEqual({
    name: "1a",
    children: [
      { name: "1.1a", children: [] },
      { name: "2a",
        children: [
          { name: "3a",
            children: [
              { name: "4a", children: [ { name: "5a", children: [] }]},
              { name: "6a", children: []},
              { name: "7a", children: [
                { name: "8a", children: [ {name: "9a", children: []} ] },
                { name: "10a", children: [] }
              ]}
            ]
          }
        ]
      }
    ]
  })
});

function toNames(event) {
  return event.name;
}
