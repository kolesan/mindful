import "@babel/polyfill";
import * as TreeUtils from '../../src/utils/TreeUtils';
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

test('visit: visits a tree using postorder traversing', () => {
  let names = [];

  TreeUtils.visit(entryPoint, node => names.push(node.name));

  expect(names).toEqual([1.1, 5, 4, 6, 9, 8, 10, 7, 3, 2, 1]);
});

test('visit does not fail if passed node is null', () => {
  TreeUtils.visit(null, () => {});
});

test('visit does not fail if passed node does not have children', () => {
  TreeUtils.visit({children: null}, () => {});
});

test('postorderRightToLeftVisitor: visits a tree using a using postorder right to left traversing', () => {
  let names = [];

  let gen = TreeUtils.postorderRightToLeftVisitor(entryPoint);
  for(let node of gen) {
    names.push(node.name);
  }

  expect(names).toEqual([10, 9, 8, 7, 6, 5, 4, 3, 2, 1.1, 1]);
});

test('flattens a tree using postorder traversing', () => {
  expect(TreeUtils.flatten(entryPoint).map(toNames)).toEqual([1.1, 5, 4, 6, 9, 8, 10, 7, 3, 2, 1]);
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

test("Mapping a tree handles nodes with no children", () => {
  expect(
    TreeUtils.map({children: null}, it => it)
  ).toEqual({children: null});
});

function toNames(event) {
  return event.name;
}
