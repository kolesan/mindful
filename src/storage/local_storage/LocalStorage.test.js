import '@babel/polyfill';
import localStorage from './LocalStorage';
import storage from '../Storage';

it(`implements the Storage interface`, () => {
  expect(typeof localStorage).toEqual("object");
  expect(storage.isPrototypeOf(localStorage)).toBeTrue();

  //Overwrites storage methods
  expect(storage).toContainAllKeys([
    "put", "get", "remove"
  ])
});