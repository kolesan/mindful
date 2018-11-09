import { create } from '../src/Component';

test('assigns passed properties to created component', () => {
  let c = {ca: "ca"};
  let cmp = create([], {
    a() {return "a"},
    b: 123,
    c
  });

  expect(cmp.b).toBe(123);
  expect(cmp.c.ca).toBe("ca");
  expect(cmp.a()).toBe("a");
});

test('can attach itself to provided container element', () => {
  let cmp = create([document.createElement("div"), document.createElement("p")]);

  let div = document.createElement("div");
  cmp.attach(div);

  expect(div.childNodes.length).toBe(2);
  expect(div.querySelectorAll("div").length).toBe(1);
  expect(div.querySelectorAll("p").length).toBe(1);
});

test('can detach itself from container element', () => {
  let cmp = create([document.createElement("div"), document.createElement("p")]);

  let div = document.createElement("div");
  cmp.attach(div);
  expect(div.childNodes.length).toBe(2);

  cmp.detach();
  expect(div.childNodes.length).toBe(0);
});
