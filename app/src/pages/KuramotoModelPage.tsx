import React, { useState, useRef } from 'react';
import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';
import OscillatorViewer from '../components/OscillatorViewer';
import './KuramotoModelPage.scss';

const KuramotoModelPage = () => {

  var refOscillatorViewer: React.RefObject<OscillatorViewer> = useRef(null);
  const [N, setN] = useState(10);
  const [K, setK] = useState(2);
  const [w0, setW0] = useState(0);
  const [gamma, setGamma] = useState(0);
  const [dt, setDt] = useState(0.01);
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

  // Cauchy Distribution
  let updateDt = (e: any) => {
    let _dt: number = Number(e.target.value);
    setDt(_dt);
    refOscillatorViewer.current?.setDt(_dt);
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
          <div className="card">

            <header className="card-header">
              <p className="card-header-title">
                ハイパーパラメータ
              </p>
            </header>

            <div className="card-content">

              <div className="field">
                <label className="label">振動子数</label>
                <div className="field is-horizontal">
                  <div className="field-label is-normal">
                    <label className="label"><TeX math="N="/></label>
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
                    <label className="label"><TeX math="K="/></label>
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
                </label>
    
                <div className="field is-horizontal">
                  <div className="field-label is-normal">
                    <label className="label"><TeX math="\omega_0="/></label>
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
                    <label className="label"><TeX math="\gamma="/></label>
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

              <div className="field">
                <label className="label">時間幅</label>
                <div className="field is-horizontal">
                  <div className="field-label is-normal">
                    <label className="label"><TeX math="\delta t="/></label>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      <div className="control">
                        <input className="input" type="number" placeholder="0.01" min="0.001" max="100" defaultValue={dt} onChange={updateDt} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <footer className="card-footer">
              <button className="card-footer-item button is-success" onClick={initModel}>初期化</button>
              <button className={"card-footer-item button is-link " + (isRunning ? "is-loading" : "")} onClick={startTimer}>実行</button>
              <button className="card-footer-item button is-danger" onClick={pauseTimer}>停止</button>
            </footer>

          </div>
        </div>
      </div>

      <div className="columns is-variable">
        <div className="column">
          <h2>蔵本モデルの概要</h2>
          <div>
            <TeX math="N" /> 体の振動子からなる蔵本モデルは次の微分方程式で表される。
            <TeX math="\frac{d\theta_i(t)}{dt} = \omega_i + \frac{K}{N}\sum_{j=1}^N \sin{( \theta_j(t) - \theta_i(t) ) }, \qquad i=1,2, ..., N \tag{1}" block />
            <TeX math="\theta_i, \omega_i" /> は <TeX math="i" /> 番目の振動子の位相と自然振動数、<TeX math="K" /> は結合強度を意味する。

            自然振動数 <TeX math="\omega_i" /> は確率密度関数 <TeX math="g(\omega)" /> に従う。
            今回のシミュレーションでは、コーシー分布 <TeX math="g(\omega; \omega_0, \gamma)" /> を考える。
            コーシー分布の確率密度関数は、
            <TeX math="g(\omega; \omega_0, \gamma)= \frac{1}{\pi} \frac{\gamma}{(\omega - \omega_0)^2 + \gamma^2}" block />
            で記述される。

          </div>

          <div>
            次に秩序変数  <TeX math="z" /> を定義する。
            <TeX math="
              \begin{aligned} 
                z &= r(t)e^{\sqrt{-1}\varphi(t)} = \frac{1}{N}\sum_{i=1}^N e^{\sqrt{-1} \theta_i(t)} \tag{2} \\
                r(t) &= \sqrt{\left(\sum_{i=1}^N \cos{\theta_i(t)}\right)^2 + \left( \sum_{i=1}^N \sin{\theta_i(t)} \right)^2} \\
                \varphi(t) &= \arctan{\left( \frac{\sum_{i=1}^N \sin{\theta_i(t)}}{\sum_{i=1}^N \cos{\theta_i(t)}} \right)}
              \end{aligned}" block>
            </TeX>
            <TeX math="r(t)" /> の大きさを見ることで、振動子が同期しているかどうかが分かる。
            <TeX math="r(t)" /> が 1 に近いほど同期しており、0 に近いほど同期していない事を表している。
          </div>

          <div>
            秩序変数を使って、(1) 式を次のように書き直すことができる。
            <TeX math="
              \begin{aligned}
                \frac{d\theta_i(t)}{dt} = \omega_i + K \times r(t) \sin{\left( \varphi(t) - \theta_i(t) \right) } \tag{3}
              \end{aligned}
              " block />
            この導出は、方程式 
            <TeX math="r(t)e^{\sqrt{-1} (\varphi(t) - \theta_i(t))}=\frac{1}{N}\sum_{j=1}^N e^{\sqrt{-1}(\theta_j(t) - \theta_i(t))}" block />
            の虚部だけ考えると、
            <TeX math="r(t)\sin{(\varphi(t) - \theta_i(t))} = \frac{1}{N}\sum_{j=1}^N \sin{(\theta_j(t) - \theta_i(t))}" block />
            が得られるので、これを (1) 式に代入すれば良い。
          </div>

          <div>
            <TeX math="g(\omega)"></TeX> がコーシー分布のときに、<TeX math="N\rightarrow \infty" /> の <TeX math="r(t)" /> の値は解析的に求まることが知られている。
            結果だけ以下に書いておく。
            <TeX math="
              \begin{aligned}
                r &=\sqrt{1.0 - \frac{K_c}{K}} \qquad (K_c < K\\
                K_c &= 2\gamma
              \end{aligned}
            " block></TeX>
          </div>

          <h2>数値シミュレーション</h2>
          <div>
            常微分方程式の数値解法の一つにオイラー法がある。
            (1) 式に前進オイラー法を適用すると、
            <TeX math="\theta_{i}^{t} = \theta_i^{t-1} + \delta t \times \left\{ \omega_i + \frac{K}{N}\sum_{j=1}^N \sin{(\theta_j^{t-1} - \theta_i^{t-1})} \right\}" block />
            が得られる。
            <TeX math="\theta_i^t" /> は時刻 <TeX math="t" /> における <TeX math="i"/> 番目の振動子の位相、<TeX math="\delta t" /> は時間幅である。これを愚直に実装すると、1ステップあたりの計算量は <TeX math="O(N^2)" /> になる。
          </div>
          <div>
            (3) 式に前進オイラー法を適用すると、
            <TeX math="\theta_{i}^{t} = \theta_i^{t-1} + \delta t \times \left\{ \omega_i + K \times r(t) \sin{\left( \varphi(t) - \theta_i(t) \right) } \right\}" block />
            が得られる。この場合、1ステップあたりの計算量は <TeX math="O(N)" /> になる。
          </div>

          <h2>参考</h2>
          <ul>
            <li><a href="https://www.math.sci.hokudai.ac.jp/~wakate/mcyr/2020/pdf/yoneda_ryosuke.pdf">米田亮介, "蔵本モデルにおける臨界指数" (2020)</a></li>
            <li><a href="https://www.jstage.jst.go.jp/article/sicejl/55/4/55_335/_article/-char/ja/">中尾 裕也, "結合位相振動子系の安定性と同期現象" (2016)</a></li>
            <li>S. H. Strogatz, "From Kuramoto to Crawford: exploring the onset of synchronization in populations of coupled oscillators", Physica 143D, 1 (2000)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default KuramotoModelPage;
