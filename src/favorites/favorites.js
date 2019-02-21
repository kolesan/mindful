import { isArray, isNormalPositiveNumber } from "../utils/Utils";

export default function favorites(programs, numberOf) {
  if (!isArray(programs) || !isNormalPositiveNumber(numberOf)) {
    return [];
  }

  return Array.from(programs)
    .sort(byTimesOpened)
    .slice(0, numberOf);
}

function byTimesOpened(a, b) {
  return b.timesOpened - a.timesOpened;
}