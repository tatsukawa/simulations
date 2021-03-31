
class Oscillator {
    public theta: number = 0; // phase
    public r: number = 0; // radius
    public omega: number = 0; // natural frequency

    constructor(theta: number, r: number, omega: number) {
        this.theta = theta;
        this.r = r;
        this.omega = omega;
    }

    getPos() {
        return {
            x: this.r * Math.cos(this.theta),
            y: this.r * Math.sin(this.theta)
        }
    }
}


export default Oscillator;