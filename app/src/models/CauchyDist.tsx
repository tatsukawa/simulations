import Dict from './Dict';

class CauchyDist {
    public omega0: number;
    public gamma: number;

    constructor(omega0: number, gamma: number) {
        this.gamma = gamma;
        this.omega0 = omega0;
    }

    sample(): number {
        return this.omega0 + this.gamma * Math.tan(Math.PI * (Math.random() - 0.5));
    }

    prob(omega: number): number {
        return (1.0 / Math.PI) * (this.gamma / ((omega - this.omega0)**2 + this.gamma**2));
    }

    dist(l: number, r: number, n: number): Array<Dict> {
        /* 区間[l, r] から等間隔にn分割した分布データを返す
        */
       let res: Array<Dict> = []

        let d = (r - l) / n;
        for(let i = 0; i < n; i++) {
            res.push({
                x: l+d*i, y:this.prob(l+d*i)
            });
        }
        
        return res;
    }
}

export default CauchyDist;
