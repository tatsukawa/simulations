import React, { useState, useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';
import OscillatorViewer from '../components/OscillatorViewer';
import KuramotoModel from '../models/KuramotoModel';
import { updateSourceFile } from 'typescript';
import './KuramotoModelPage.scss';

const KuramotoModelPage = () => {

  var refOscillatorViewer: React.RefObject<OscillatorViewer> = useRef(null);
  const [N, setN] = useState(10);
  const [K, setK] = useState(2);
  const [w0, setW0] = useState(0);
  const [gamma, setGamma] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | number>(0)

  // Number of oscillators N
  let updateN = (e: any) => {
    let n: number = Number(e.target.value);
    setN(n);
    refOscillatorViewer.current?.setN(n);
  }

  // Coupling strength
  let updateK = (e: any) => {
    let k: number = Number(e.target.value);
    setK(k);
    refOscillatorViewer.current?.setK(k);
  }

  // Cauchy Distribution
  let updateW0 = (e: any) => {
    let _w0: number = Number(e.target.value);
    setW0(_w0);
    refOscillatorViewer.current?.setW0(_w0);
  }

  // Cauchy Distribution
  let updateGamma = (e: any) => {
    let _gamma: number = Number(e.target.value);
    setGamma(_gamma);
    refOscillatorViewer.current?.setGamma(_gamma);
  }

  // timer 
  let startTimer = () => {
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
        <div className="column is-9">
          <OscillatorViewer ref={refOscillatorViewer} />
        </div>

        <div className="column is-2 is-offset-1">
          <div className="field">
            <label className="label">ノード数</label>

            <div className="field is-horizontal">
              <div className="field-label is-normal">
                <label className="label"><TeX math="N="></TeX></label>
              </div>
              <div className="field-body">
                <div className="field">
                  <div className="control">
                    <input className="input" type="number" placeholder="10" min="1" max="100" defaultValue={N} onChange={updateN} />
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="field">
            <label className="label">結合強度</label>

            <div className="field is-horizontal">
              <div className="field-label is-normal">
                <label className="label"><TeX math="K="></TeX></label>
              </div>
              <div className="field-body">
                <div className="field">
                  <div className="control">
                    <input className="input" type="number" placeholder="10.0" min="0" max="100" defaultValue={K} onChange={updateK} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label">
              コーシー分布<br />
              <TeX math="g(\omega; \omega_0, \gamma)= \frac{1}{\pi} \frac{\gamma}{(\omega - \omega_0)^2 + \gamma^2}" />
            </label>

            <div className="field is-horizontal">
              <div className="field-label is-normal">
                <label className="label"><TeX math="\omega_0="></TeX></label>
              </div>
              <div className="field-body">
                <div className="field">
                  <div className="control">
                    <input className="input" type="number" placeholder="0.0" min="-10" max={10} defaultValue={0} onChange={updateW0} />
                  </div>
                </div>
              </div>
            </div>

            <div className="field is-horizontal">
              <div className="field-label is-normal">
                <label className="label"><TeX math="\gamma="></TeX></label>
              </div>
              <div className="field-body">
                <div className="field">
                  <div className="control">
                    <input className="input" type="number" placeholder="0.0" min="-10" max="10" defaultValue={1.0} onChange={updateGamma} />
                  </div>
                </div>
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
          <p>
            <TeX math="N" /> 体の振動子からなる蔵本モデルは次の微分方程式で表される。
            <TeX math="\frac{d\theta_i(t)}{dt} = \omega_i + \frac{K}{N}\sum_{j=1}^N \sin{( \theta_j(t) - \theta_i(t) ) }, \qquad i=1,2, ..., N \tag{1}" block />
            <TeX math="\theta_i, \omega_i"></TeX> は <TeX math="i"></TeX> 番目の振動子の位相と自然振動数、<TeX math="K"></TeX> は結合強度を意味する。

            自然振動数 <TeX math="\omega_i"></TeX> は確率密度関数 <TeX math="g(\omega)"></TeX> に従う。
            今回のシミュレーションでは、コーシー分布 <TeX math="g(\omega; \omega_0, \gamma)"></TeX> を考える。
          </p>

          <p>
            次に秩序変数  <TeX math="z" /> を定義する。
            <TeX math="
              \begin{aligned} 
                z &= r(t)e^{\sqrt{-1}\varphi(t)} = \frac{1}{N}\sum_{i=1}^N e^{\sqrt{-1} \theta_i(t)} \tag{2} \\
                r(t) &= \sqrt{\left(\sum_{i=1}^N \cos{\theta_i(t)}\right)^2 + \left( \sum_{i=1}^N \sin{\theta_i(t)} \right)^2} \\
                \varphi(t) &= \arctan{\left( \frac{\sum_{i=1}^N \sin{\theta_i(t)}}{\sum_{i=1}^N \cos{\theta_i(t)}} \right)}
              \end{aligned}" block>
            </TeX>
            <TeX math="r(t)"></TeX> の大きさを見ることで、振動子が同期しているかどうかが分かる。
            <TeX math="r(t)"></TeX> が 1 に近いほど同期しており、0 に近いほど同期していない事を表している。
          </p>

          <p>
            秩序変数を使って、(1) 式を次のように書き直すことができる。
            <TeX math="
              \begin{aligned}
                \frac{d\theta_i(t)}{dt} = \omega_i + K \times r(t) \sin{\left( \varphi(t) - \theta_i(t) \right) } \tag{3}
              \end{aligned}
              " block />
            この導出は、方程式 
            <TeX math="r(t)e^{\sqrt{-1} (\varphi - \theta_i)}=\frac{1}{N}\sum_{j=1}^N e^{\sqrt{-1}(\theta_j - \theta_i)}" block></TeX>
            の虚部だけを考えると、
            <TeX math="r(t)\sin{(\varphi(t) - \theta_i(t))} = \frac{1}{N}\sum_{j=1}^N \sin{(\theta_j(t) - \theta_i(t))}" block></TeX>
            が得られるので、これを (1) 式に代入すれば良い。
          </p>

          <h2>数値シミュレーション</h2>
          <p>
            常微分方程式の数値解法の一つにオイラー法がある。
            (1) 式に前進オイラー法を適用すると、
            <TeX math="\theta_{i}^{t} = \theta_i^{t-1} + \delta t \times \left\{ \omega_i + \frac{K}{N}\sum_{j=1}^N \sin{(\theta_j^{t-1} - \theta_i^{t-1})} \right\}" block></TeX>
            が得られる。
            <TeX math="\theta_i^t"></TeX> は時刻 <TeX math="t"></TeX> における <TeX math="i"></TeX> 番目の振動子の位相、<TeX math="\delta t"></TeX> は時間幅である。これを愚直に実装すると、1ステップあたりの計算量は <TeX math="O(N^2)"></TeX> になる。
          </p>
          <p>
            (2) 式に前進オイラー法を適用すると、
            <TeX math="\theta_{i}^{t} = \theta_i^{t-1} + \delta t \times \left\{ \omega_i + K \times r(t) \sin{\left( \varphi(t) - \theta_i(t) \right) } \right\}" block></TeX>
            が得られる。この場合、1ステップあたりの計算量は <TeX math="O(N)"></TeX> になる。
          </p>

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
