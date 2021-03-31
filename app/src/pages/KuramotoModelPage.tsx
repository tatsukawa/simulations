import React, { useState, useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';
import OscillatorViewer from '../components/OscillatorViewer';
import KuramotoModel from '../models/KuramotoModel';
import { updateSourceFile } from 'typescript';

const KuramotoModelPage = () => {

  var refOscillatorViewer: React.RefObject<OscillatorViewer> = useRef(null);
  const [N, setN] = useState(10);
  const [K, setK] = useState(2);
  const [isRunning, setIsRunning] = useState(false);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | number>(0)

  // Number of oscillators N
  let updateN = (e: any) => {
    refOscillatorViewer.current?.setN(e.target.value);
  }

  // Coupling strength
  let updateK = (e: any) => {
    refOscillatorViewer.current?.setK(e.target.value);
  }

  // timer 
  let startTimer = () => {
    console.log(refOscillatorViewer);
    setIsRunning(true);
    setTimerId(setInterval(() => {
      refOscillatorViewer.current?.update();
    }, 15));
  }

  let pauseTimer = () => {
    clearInterval(timerId as number);
    setIsRunning(false);
  }

  let initModel =() => {
    if(isRunning) {
      clearInterval(timerId as number);
      setIsRunning(false);
    }

    refOscillatorViewer.current?.init();
  }

  return (
    <div className="content">
      <div className="columns is-variable">
        <div className="column is-three-quarters">
          <OscillatorViewer ref={refOscillatorViewer} />
        </div>

        <div className="column">
          <div className="field">
            <label className="label">ノード数 <TeX math="N" /></label>
            <div className="control">
              <input className="input" type="number" placeholder="10" min="1" max="100" defaultValue={N} onChange={updateN} />
            </div>
          </div>

          <div className="field">
            <label className="label">結合強度 <TeX math="K" /> </label>
            <div className="control">
              <input className="input" type="number" placeholder="10.0" min="0" max="100" defaultValue={K} onChange={updateK} />
            </div>
          </div>

          <div className="field">
            <label className="label">自然振動数 <TeX math="\omega"/> の確率密度関数 <TeX math="g(\omega)" /></label>
            <div className="control">
              <div className="select">
                <select>
                  <option>コーシー分布</option>
                </select>
              </div>
            </div>
          </div>

          <div className="field is-grouped">
            <div className="control">
              <button className="button is-success" onClick={initModel}>初期化</button>
            </div>
            <div className="control">
              <button className={"button is-link " + (isRunning ? "is-loading" : "")} onClick={startTimer}>実行</button>
            </div>
            <div className="control">
              <button className="button is-danger" onClick={pauseTimer}>停止</button>
            </div>
          </div>
        </div>
      </div>

      <div className="columns is-variable">
        <div className="column">
          <h2>蔵本モデルの概要</h2>
            <TeX math="N" /> 体の振動子からなる蔵本モデルは次の微分方程式で表される。
            <TeX math="\frac{d\theta_i(t)}{dt} = \omega_i + \frac{K}{N}\sum_{j=1}^N \sin{\{ \theta_j(t) - \theta_i(t) \} } \tag{1}" block />
            ここで、<TeX math="K"></TeX> は結合強度、<TeX math="\omega_i"></TeX> は自然振動数である。
            自然振動数 <TeX math="\omega_i"></TeX> はコーシー分布 <TeX math="g(\omega; \omega_0, \gamma)"></TeX> に従うものとする。
            <TeX math="g(\omega; \omega_0, \gamma) = \frac{1}{\pi} \frac{\gamma}{(\omega - \omega_0)^2 + \gamma^2}" block></TeX>

            同期が起きているかどうかを確認するため、秩序変数  <TeX math="z" /> を定義する。
            <TeX math="z:=\left| \frac{1}{N}\sum_{i=1}^N e^{\sqrt{-1} \theta_i(t)} \right|" block />

          <h2>数値シミュレーション</h2>
            常微分方程式の数値解法の一つにオイラー法がある。
            蔵本モデルに(前進)オイラー法を適用すると、
            <TeX math="\theta_{i}^{t} = \theta_i^{t-1} + \delta t \times \left\{ \omega_i + \frac{K}{N}\sum_{j=1}^N \sin{(\theta_j^{t-1} - \theta_i^{t-1})} \right\} \tag{2}" block></TeX>
            が得られる。
            ここで、 <TeX math="\theta_i^t"></TeX> は時刻 <TeX math="t"></TeX> における <TeX math="i"></TeX> 番目の振動子の位相、<TeX math="\delta t"></TeX> は時間幅である。
            このプログラムも (2) 式を愚直に実装している。
          <h2>参考</h2>
          <ul>
            <li><a href="https://www.math.sci.hokudai.ac.jp/~wakate/mcyr/2020/pdf/yoneda_ryosuke.pdf">米田亮介, "蔵本モデルにおける臨界指数" (2020)</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default KuramotoModelPage;
