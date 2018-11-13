import * as TreeVisitor from '../src/TreeUtils';
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

test('walks a tree', () => {
  // let visitor = TreeVisitor.preorderTreeVisitor(entryPoint);
  // let a = visitor.next();
  // while(!a.done) {
  //   console.log(a.value);
  //   a = visitor.next();
  // }
  console.log(TreeVisitor.reduceTree(entryPoint, (a, b) => a.name > b.name ? a : b));
  console.log(TreeVisitor.reduceTree(entryPoint, (a, b) => a.name > b.name ? b : a));
  console.log(TreeVisitor.reduceTree(entryPoint, (a, b) => Math.abs(5 - a.name) < Math.abs(5 - b.name) ? a : b));
});