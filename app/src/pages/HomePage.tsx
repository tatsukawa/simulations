import './HomePage.scss';
import {
  Link
} from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="columns is-variable">
      <div className="column">
        <div className="content">
          <h1>トップページ</h1>

          実装した数値シミュレーションを眺めるだけのサイト。

          <ul>
            <li>
              <Link to="/kuramoto-model">蔵本モデル</Link>
            </li>
            <li>
              <Link to="/ising-model">イジングモデル</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
