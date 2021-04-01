import React from 'react';
import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';
import OscillatorViewer from '../components/OscillatorViewer'
import Oscillator from './Oscillator';
import CauchyDist from './CauchyDist';
import Dict from './Dict';


class KuramotoModel {
    public N: number;
    public K: number;
    public oscillators: Oscillator[];
    public record_order_param: Array<Dict>;
    private limit_size: number;
    public dt: number;
    public iteration: number;
    public g: CauchyDist;

    constructor(N: number, K: number) {
        this.N = N;
        this.K = K;
        this.dt = 0.01;
        this.iteration = 0;
        this.limit_size = 100;
        this.oscillators = [];
        this.record_order_param = [];
        this.g = new CauchyDist(0.0, 1.0);

        for(let i = 0; i < N; i++) {
            this.oscillators.push(new Oscillator(this.uniformDist(0, 2*Math.PI), 1, this.g.sample()));
        }

        this.record_order_param.push({
            iter: this.iteration,
            order_param: this.calcOrderParam()
        });

        this.run = this.run.bind(this);
    }

    updateK(K: number) {
        this.K = K;
    }

    updateW0(w0: number) {
        this.g.omega0 = w0;        
    }

    updateGamma(gamma: number) {
        this.g.gamma = gamma;        
    }

    uniformDist(low: number , high: number): number {
        return Math.random() * (high - low) - low;
    }

    calcOrderParam(): number {
        let x = 0.0;
        let y = 0.0;
        for(let o of this.oscillators) {
            x += Math.cos(o.theta);
            y += Math.sin(o.theta);
        }

        return Math.sqrt(x*x + y*y) / this.N;
    }

    calcOrderParamArg(): number {
        let x = 0.0;
        let y = 0.0;
        for(let o of this.oscillators) {
            x += Math.cos(o.theta);
            y += Math.sin(o.theta);
        }
        return Math.atan2(y, x);
    }

    run() {
        /*  O(N) code
        */
        this.iteration += 1;

        let next_osc: Array<Oscillator> = Array.from(this.oscillators);

        let r = this.calcOrderParam();
        let phi = this.calcOrderParamArg();

        for(let i = 0; i < this.N; i++) {
            next_osc[i].theta += this.dt * (this.oscillators[i].omega + this.K * r * Math.sin(phi - this.oscillators[i].theta));
        }

        this.oscillators = next_osc;

        this.record_order_param.push({
            iter: this.iteration * this.dt,
            order_param: this.calcOrderParam()
        });

        if (this.record_order_param.length > this.limit_size) {
            this.record_order_param.shift();
        }

    }
   
    run_slow() {
        /* O(N^2) code
        */
        this.iteration += 1;

        let next_osc: Array<Oscillator> = Array.from(this.oscillators);
        for(let i = 0; i < this.N; i++) {
            next_osc[i].theta += this.dt * this.oscillators[i].omega;

            for(let j = 0; j < this.N; j++) {
                next_osc[i].theta += this.dt * (this.K / this.N) * Math.sin(this.oscillators[j].theta - this.oscillators[i].theta);
            }
        }

        this.oscillators = next_osc;

        this.record_order_param.push({
            iter: this.iteration * this.dt,
            order_param: this.calcOrderParam()
        });

        if (this.record_order_param.length > this.limit_size) {
            this.record_order_param.shift();
        }
    }
}

export default KuramotoModel;
