import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';

const KuramotoModel = () => {
  return (
    <div className="content">
      <div className="columns is-variable">
        <div className="column is-four-fifths">
          <canvas></canvas>
        </div>

        <div className="column">
          <div className="field">
            <label className="label">ノード数 <TeX math="N" /></label>
            <div className="control">
              <input className="input" type="number" placeholder="2" min="1" max="100" />
            </div>
          </div>

          <div className="field">
            <label className="label">結合強度 <TeX math="K" /> </label>
            <div className="control">
              <input className="input" type="number" placeholder="10.0" min="0" max="100" />
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
              <button className="button is-link">実行</button>
            </div>
            <div className="control">
              <button className="button is-link is-light">停止</button>
            </div>
          </div>
        </div>
      </div>

      <div className="columns is-variable">
        <div className="column">
          <h2>蔵本モデルの概要</h2>
            <TeX math="N" /> 体の振動子からなる蔵本モデルは次の微分方程式で表される。
            <TeX math="\frac{d\theta_i(t)}{dt} = \omega_i + \frac{K}{N}\sum_{j=1}^N \sin{\{ \theta_i(t) - \theta_j(t) \} }" block />
            同期が起きているかどうかを確認するための秩序変数  <TeX math="z" /> を次のように定義する。
            <TeX math="z:=\frac{1}{N}\sum_{j=1}^N e^{i\theta_j(t)}" block />
        </div>
      </div>
    </div>
  );
}

export default KuramotoModel;
