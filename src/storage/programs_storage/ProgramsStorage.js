import { log } from '../../utils/Logging';

import localStorage from '../local_storage/LocalStorage';
import converter from '../../program_model_converters/json_ready/JSONReadyProgramConverter';
import { optional } from '../../utils/FunctionalUtils';
import { noSpaces, removeFromArray } from "../../utils/Utils";

const STORAGE_KEY = "programs";

export default inst(localStorage);

export function inst(storage) {
  return Object.freeze({
    save(program) {
      validate(program);

      let id = idFromTitle(program);
      let programs = loadAndDeserialize();

      if (programs.find(it => it.id === id)) {
        throw Error(`Program with title '${program.title}' and id '${id}' already exists. Consider using 'update'`);
      }

      programs.push({ ...program, id});
      serializeAndSave(programs);

      return id;
    },
    update(id, program) {
      let programs = loadAndDeserialize();
      optional(programs.find(it => it.id === id))
        .ifEmpty(() => {
          throw Error(`Program with id '${id}' not found`);
        });

      validate(program);

      let newId = idFromTitle(program);

      let updatedPrograms = removeFromArray(programs, it => it.id === id);
      updatedPrograms.push({ ...program, id: newId});
      serializeAndSave(updatedPrograms);

      return newId;
    },
    remove(id) {
      serializeAndSave(
        removeFromArray(
          loadAndDeserialize(), program => program.id === id
        )
      );
    },
    load(id) {
      return optional(loadAndDeserialize().find(program => program.id === id));
    },
    loadAll() {
      return loadAndDeserialize();
    }
  });

  function loadAndDeserialize() {
    let programs = storage.get(STORAGE_KEY) || [];
    return programs.map(converter.deserialize);
  }

  function serializeAndSave(programs) {
    storage.put(STORAGE_KEY, programs.map(converter.serialize));
  }

  function idFromTitle(program) {
    return noSpaces(program.title);
  }

  function validate(newProgram) {
    if (noSpaces(newProgram.title).length === 0) {
      throw Error(`Program title can not be empty`);
    }
  }

}