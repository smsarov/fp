/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */

import {
  __,
  allPass,
  andThen,
  both,
  flip,
  gt,
  ifElse,
  invoker,
  length,
  lt,
  pipe,
  prop,
  tap,
  test,
  tryCatch,
  unary,
  otherwise,
} from "ramda";
import Api from "../tools/api";

const api = new Api();

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  // Валидация
  const hasValidLength = pipe(length, both(gt(__, 2), lt(__, 10)));
  const isPositive = pipe(unary(parseFloat), lt(0));
  const hasValidChars = test(/^[0-9.]+$/);
  const hasAtMostOneDot = (str) => (str.match(/\./g) || []).length <= 1;
  const doesNotStartWithDot = (str) => !str.startsWith(".");

  const isValid = allPass([
    hasValidLength,
    isPositive,
    hasValidChars,
    hasAtMostOneDot,
    doesNotStartWithDot,
  ]);

  // API get
  const getApi = flip(invoker(1, "get"))(api);
  const getNumberBase = getApi("https://api.tech/numbers/base");
  const getAnimalById = (id) => getApi(`https://animals.tech/${id}`)({});

  const toRoundedNumber = pipe(unary(parseFloat), Math.round);

  const handleValidationError = () => handleError("ValidationError");
  const handleApiError = () => handleError("API Error");

  const processValid = pipe(
    toRoundedNumber,
    tap(writeLog),
    (rounded) =>
      getNumberBase({
        from: 10,
        to: 2,
        number: rounded,
      }),
    andThen(
      pipe(
        prop("result"),
        tap(writeLog),
        (binaryStr) => {
          const len = binaryStr.length;
          writeLog(len);
          const squared = len ** 2;
          writeLog(squared);
          const mod = squared % 3;
          writeLog(mod);
          return mod;
        },
        getAnimalById,
        andThen(prop("result")),
        andThen(handleSuccess)
      )
    ),
    otherwise(handleApiError)
  );

  return tryCatch(
    pipe(tap(writeLog), ifElse(isValid, processValid, handleValidationError)),
    handleValidationError
  )(value);
};

export default processSequence;
