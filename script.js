const EPS = 0.0001; // 許容誤差
let currentFunction = null;
let iterationData = [];

/**
 * ニュートン法による根の計算
 */
function newtonMethod(initialValue) {
  console.log("ニュートン法による数値計算開始");

  let a = parseFloat(initialValue);
  let b;
  iterationData = [];

  const outputDiv = document.getElementById('simulationOutput');
  outputDiv.innerHTML = ''; // 初期化

  let iteration = 0;

  while (true) {
    try {
      const y = currentFunction.evaluate({ x: a });
      const derivative = math.derivative(currentFunction, 'x').evaluate({ x: a });
      b = a - y / derivative;

      outputDiv.innerHTML += `反復回数 ${iteration}: x = ${b.toFixed(6)}<br>`;
      iterationData.push({ iteration: iteration++, error: Math.abs(a - b) });

      if (Math.abs(a - b) < EPS) break;  // 収束判定
      else a = b;
    } catch (error) {
      console.error('Error in Newton step:', error);
      outputDiv.innerHTML += `\nエラー: ${error.message}`;
      return;
    }
  }

  outputDiv.innerHTML += `\n近似解 x = ${b.toFixed(6)}`;
  plotConvergence();
}

/**
 * 二分法による根の計算
 */
function bisectionMethod(a, b) {
  console.log("二分法による数値計算開始");

  iterationData = [];

  const outputDiv = document.getElementById('simulationOutput');
  outputDiv.innerHTML = ''; // 初期化

  let iteration = 0;

  while (Math.abs(b - a) > EPS) {
    const c = (a + b) / 2;
    const f_c = currentFunction.evaluate({ x: c });

    outputDiv.innerHTML += `反復回数 ${iteration}: x = ${c.toFixed(6)}<br>`;
    iterationData.push({ iteration: iteration++, error: Math.abs(f_c) });

    if (f_c === 0 || Math.abs(b - a) < EPS) {
      a = c;
      break;
    }

    const f_a = currentFunction.evaluate({ x: a });

    if (f_a * f_c < 0) {
      b = c;
    } else {
      a = c;
    }
  }

  outputDiv.innerHTML += `\n近似解 x = ${(a + b) / 2}`;
  plotConvergence();
}

/**
 * 初期化とニュートン法シミュレーション開始
 */
function initializeNewton() {
  const functionInput = document.getElementById('functionInput').value.trim();
  const initialValue = document.getElementById('initialValueNewton').value.trim();

  try {
    currentFunction = math.parse(functionInput);
    newtonMethod(initialValue); // 初期値を渡す
  } catch (error) {
    console.error('Invalid function input:', error);
    alert('無効な関数式です。正しい形式で入力してください。');
  }
}

/**
 * 初期化と二分法シミュレーション開始
 */
function initializeBisection() {
  const functionInput = document.getElementById('functionInput').value.trim();
  const initialValueA = document.getElementById('initialValueA').value.trim();
  const initialValueB = document.getElementById('initialValueB').value.trim();

  try {
    currentFunction = math.parse(functionInput);
    bisectionMethod(parseFloat(initialValueA), parseFloat(initialValueB)); // 初期値を渡す
  } catch (error) {
    console.error('Invalid function input:', error);
    alert('無効な関数式です。正しい形式で入力してください。');
  }
}

/**
 * 収束プロットを描画
 */
function plotConvergence() {
  const trace = {
    x: iterationData.map(d => d.iteration),
    y: iterationData.map(d => d.error),
    mode: 'lines+markers',
    type: 'scatter',
    marker: { color: 'rgba(17, 157, 255, 0.7)' },
    line: { color: 'rgba(17, 157, 255, 0.5)' }
  };

  const layout = {
    title: '収束速度',
    xaxis: { title: '反復回数' },
    yaxis: { title: '誤差', type: 'log' },
    plot_bgcolor: '#f0f4f8',
    paper_bgcolor: '#fff'
  };

  Plotly.newPlot('convergencePlot', [trace], layout);
}
