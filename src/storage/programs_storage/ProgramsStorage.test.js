import '@babel/polyfill';

import { log } from '../../../test/TestUtils';
import { inst as newProgramsStorage } from './ProgramsStorage';

function newMockStorage() {
  let store = new Map();
  return {
    store: store,
    put: jest.fn((k, v) => store.set(k, v)),
    get: jest.fn(k => store.get(k)),
    remove: jest.fn(k => store.delete(k))
  };
}

it(`allows saving a program`, () => {
  let mockStorage = newMockStorage();
  let programsStorage = newProgramsStorage(mockStorage);

  let program = {
    title: "MyProgram"
  };
  let otherProgram = {
    title: "MyOtherProgram"
  };

  let id = programsStorage.save(program);
  let otherId = programsStorage.save(otherProgram);

  let loadedProgram = programsStorage.load(id).value;
  let otherLoadedProgram = programsStorage.load(otherId).value;

  let allPrograms = programsStorage.loadAll();

  expect(program.title).toEqual(loadedProgram.title);
  expect(otherProgram.title).toEqual(otherLoadedProgram.title);
  expect(allPrograms.map(it => it.title)).toEqual([
    "MyProgram", "MyOtherProgram"
  ])
});

it(`saved program id is it's title without whitespace`, () => {
  let mockStorage = newMockStorage();
  let programsStorage = newProgramsStorage(mockStorage);

  let program = {
    title: "My   Program"
  };
  let otherProgram = {
    title: "My  Other  Program"
  };

  let id = programsStorage.save(program);
  let otherId = programsStorage.save(otherProgram);

  expect(id).toEqual("MyProgram");
  expect(otherId).toEqual("MyOtherProgram");
});

it(`allows updating saved program`, () => {
  let mockStorage = newMockStorage();
  let programsStorage = newProgramsStorage(mockStorage);

  let program = {
    title: "MyProgram",
    description: "D'oh"
  };

  let id = programsStorage.save(program);
  program.description = "Not D'oh";
  programsStorage.update(id, program);

  let loadedUpdatedProgram = programsStorage.load(id).value;

  expect(loadedUpdatedProgram.id).toEqual(id);
  expect(loadedUpdatedProgram.description).toEqual("Not D'oh");
});

it(`updating program title changes it's id`, () => {
  let mockStorage = newMockStorage();
  let programsStorage = newProgramsStorage(mockStorage);

  let program = {
    title: "MyProgram"
  };

  let id = programsStorage.save(program);

  program.title = "UpdatedTitle";
  let newId = programsStorage.update(id, program);

  let loadedUpdatedProgram = programsStorage.load(newId).value;

  expect(programsStorage.load(id).isEmpty()).toEqual(true);
  expect(loadedUpdatedProgram.title).toEqual("UpdatedTitle");
});



it(`allows removing a program by id`, () => {
  let mockStorage = newMockStorage();
  let programsStorage = newProgramsStorage(mockStorage);

  let program = { title: "MyProgram" };

  let id = programsStorage.save(program);
  programsStorage.save({ title: "MyOtherProgram" });
  programsStorage.save({ title: "MyOtherOtherProgram" });

  programsStorage.remove(id);

  expect(programsStorage.loadAll().map(it => it.title)).toEqual([
    "MyOtherProgram", "MyOtherOtherProgram"
  ])
});

it(`fails silently if program is not found during removal`, () => {
  let mockStorage = newMockStorage();
  let programsStorage = newProgramsStorage(mockStorage);

  let program = { title: "MyProgram" };

  let id = programsStorage.save(program);
  programsStorage.save({ title: "MyOtherProgram" });
  programsStorage.save({ title: "MyOtherOtherProgram" });

  programsStorage.remove(id);
  programsStorage.remove(id);

  expect(true).toEqual(true, "Second removal failed silently");
  expect(programsStorage.loadAll().map(it => it.title)).toEqual([
    "MyOtherProgram", "MyOtherOtherProgram"
  ])
});

it(`fails to save program if title is not unique (ignoring whitespaces)`, () => {
  let mockStorage = newMockStorage();
  let programsStorage = newProgramsStorage(mockStorage);

  let program = {
    title: "My         Program"
  };
  let otherProgram = {
    title: "My Program"
  };

  programsStorage.save(program);
  expect(() => programsStorage.save(otherProgram))
    .toThrowWithMessage(Error,
      /Program with title 'My Program' and id 'MyProgram' already exists/
    );
});

it(`fails to save program if title is empty (ignoring whitespace)`, () => {
  let mockStorage = newMockStorage();
  let programsStorage = newProgramsStorage(mockStorage);

  let program = {
    title: "        "
  };

  expect(() => programsStorage.save(program))
    .toThrowWithMessage(Error,
      /Program title can not be empty/
    );
});

it(`fails to update program if no program with provided id exists`, () => {
  let mockStorage = newMockStorage();
  let programsStorage = newProgramsStorage(mockStorage);

  let program = {
    title: "MyProgram"
  };

  let id = programsStorage.save(program);

  let loadedProgram = programsStorage.load(id).value;
  loadedProgram.title = "UpdatedTitle";

  expect(() => programsStorage.update("SomeNonexistentId", loadedProgram))
    .toThrowWithMessage(Error,
      /Program with id 'SomeNonexistentId' not found/
    );

});