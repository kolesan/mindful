import { inst as newSettingsStorage } from './SettingsStorage';
import defaultSettings from '../../settings/Settings';
import { log } from '../../../test/TestUtils';

function newMockStorage() {
  let store = new Map();
  return {
    store: store,
    put: jest.fn((k, v) => store.set(k, v)),
    get: jest.fn(k => store.get(k)),
    remove: jest.fn(k => store.delete(k))
  };
}

it(`returns default settings if none were saved yet`, () => {
  let mockStorage = newMockStorage();
  let settingsStorage = newSettingsStorage(mockStorage);

  expect(settingsStorage.load()).toEqual(defaultSettings);
});

it(`allows saving and loading of settings`, () => {
  let mockStorage = newMockStorage();
  let settingsStorage = newSettingsStorage(mockStorage);
  let settings = {
    volume: 100500
  };
  settingsStorage.save(settings);
  let loadedSettings = settingsStorage.load();

  expect(loadedSettings).toEqual(settings);
});

it(`loads a new settings object every time`, () => {
  let mockStorage = newMockStorage();
  let settingsStorage = newSettingsStorage(mockStorage);
  let settings = {
    volume: 100500
  };
  settingsStorage.save(settings);

  let loadedSettings = settingsStorage.load();
  loadedSettings.someProp = "d";

  let otherLoadedSettings = settingsStorage.load();

  expect(loadedSettings).toEqual({
    volume: 100500,
    someProp: "d"
  });
  expect(otherLoadedSettings).toEqual({
    volume: 100500,
  })
});

it(`updates only the provided settings`, () => {
  let mockStorage = newMockStorage();
  let settingsStorage = newSettingsStorage(mockStorage);
  let settings = {
    volume: 100500
  };
  settingsStorage.save(settings);
  let loadedSettings = settingsStorage.load();

  settingsStorage.save({
    someSetting: "d"
  });
  let updatedLoadedSettings = settingsStorage.load();

  settingsStorage.save({
    volume: 0
  });
  let withVolume0 = settingsStorage.load();

  expect(loadedSettings).toEqual({
    volume: 100500
  });
  expect(updatedLoadedSettings).toEqual({
    volume: 100500,
    someSetting: "d"
  });
  expect(withVolume0).toEqual({
    volume: 0,
    someSetting: "d"
  })
});