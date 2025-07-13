/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import * as R from "ramda";

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = ({ star, square, triangle, circle }) => {
  if (triangle !== "white" || circle !== "white") {
    return false;
  }

  return star === "red" && square === "green";
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = R.pipe(
  R.values,
  R.filter(R.equals("green")),
  R.length,
  R.lte(2)
);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = R.pipe(
  R.values,
  R.countBy(R.identity),
  ({ red, blue }) => red === blue
);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = ({ star, square, triangle, circle }) => {
  return circle === "blue" && star === "red" && square === "orange";
};

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = R.pipe(
  R.values,
  R.filter(R.complement(R.equals("white"))),
  R.countBy(R.identity),
  R.values,
  R.any(R.lte(3))
);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
const countColor = (color) =>
  R.pipe(R.values, R.countBy(R.identity), R.propOr(0, color));

export const validateFieldN6 = R.allPass([
  R.pipe(countColor("green"), R.equals(2)),
  ({ triangle }) => triangle === "green",
  R.pipe(countColor("red"), R.equals(1)),
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = R.pipe(R.values, R.all(R.equals("orange")));

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = R.pipe(
  R.prop("star"),
  R.complement(R.either(R.equals("red"), R.equals("white")))
);

// 9. Все фигуры зеленые.
export const validateFieldN9 = R.pipe(R.values, R.all(R.equals("green")));

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = R.allPass([
  R.converge(R.equals, [R.prop("triangle"), R.prop("square")]),
  R.pipe(R.prop("triangle"), R.complement(R.equals("white"))),
]);
