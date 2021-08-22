var express = require('express');
const { response } = require('../app');
var router = express.Router();
//var compute = require("./compute");
var bodyParser = require('body-parser')

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


function Calculate(tableRowData,matrix) {
  console.log(tableRowData)
  rows = tableRowData.length
  console.log(rows)
  var M;
  M = rows;
  var Xk = [];
  var Zk = [];
  var Rk = [];
  var Sz = [];
  var alpha, beta, mf;
  var Spr, Spr1, Spz;
  var F = [];
  var i, j;
  var max_iter = 100000;
  var E = 0.001;
  for (i = 0; i < M; i++) {
    F[i] = matrix[i];
  }
  console.log(F);
  /* Вычисляем сумму квадратов элементов вектора F*/
  for (mf = 0, i = 0; i < M; i++) {
    mf += F[i] * F[i];
  }

  /* Задаем начальное приближение корней. В Хk хранятся значения корней
   * к-й итерации. */
  for (i = 0; i < M; i++) {
    Xk[i] = 0.2;
  }
  /* Задаем начальное значение r0 и z0. */
  for (i = 0; i < M; i++) {
    Sz[i] = 0;
    for (j = 0; j < M; j++) {
      Sz[i] += tableRowData[i][j] * Xk[j];
    }
    Rk[i] = F[i] - Sz[i];
    Zk[i] = Rk[i];
  }
  var Iteration = 0;
  do {
    Iteration++;
    /* Вычисляем числитель и знаменатель для коэффициента
     * alpha = (rk-1,rk-1)/(Azk-1,zk-1) */
    Spz = 0;
    Spr = 0;
    for (i = 0; i < M; i++) {
      for (Sz[i] = 0, j = 0; j < M; j++) {
        Sz[i] += tableRowData[i][j] * Zk[j];
      }
      Spz += Sz[i] * Zk[i];
      Spr += Rk[i] * Rk[i];
    }
    alpha = Spr / Spz; /*  alpha    */
    Spr1 = 0;
    for (i = 0; i < M; i++) {
      Xk[i] += alpha * Zk[i];
      Rk[i] -= alpha * Sz[i];
      Spr1 += Rk[i] * Rk[i];
    }
    /* Вычисляем  beta  */
    beta = Spr1 / Spr;

    /* Вычисляем вектор спуска: zk = rk+ beta * zk-1 */
    for (i = 0; i < M; i++) {
      Zk[i] = Rk[i] + beta * Zk[i];
    }
  } while (
    /* Проверяем условие выхода из итерационного цикла  */
    Spr1 / mf > E * E &&
    Iteration < max_iter
  );
  console.log(Xk);
  return Xk;
}

/* GET users listing. */
router.post('/', function(req, res, next) {
  var xk = Calculate(req.body.table,req.body.matrix)
  console.log(req.body.table,req.body.matrix)
  //Send data to client
  res.json(xk)
  console.log(xk)
});

module.exports = router;