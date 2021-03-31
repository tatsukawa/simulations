import React, {createRef, useEffect, useRef} from 'react';
import './OscillatorViewer.scss';
import KuramotoModel from '../models/KuramotoModel';
import Oscillator from '../models/Oscillator';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


type Dict = {
    [key: string]: number
};

interface OscillatorProps {
}

interface OscillatorState {
  model: KuramotoModel,
  data: Dict[],
  z: Oscillator
}

type Point = {
  x: number;
  y: number;
}

class OscillatorViewer extends React.Component<OscillatorProps, OscillatorState> {

  private canvasRef: React.RefObject<HTMLCanvasElement>;
  private center: Point;
  private radius: number;

  constructor(props: OscillatorProps) {
    super(props);
    this.canvasRef = React.createRef();
    this.center = {x:0, y:0};
    this.radius = 0;

    let model = new KuramotoModel(10, 10);

    this.state = {
      model: model,
      data: [],
      z: new Oscillator(model.calcOrderParamArg(), model.calcOrderParam(), 0)
    };
  }

  init() {
    let model = new KuramotoModel(this.state.model.N, this.state.model.K);
    this.setState({
      model: model,
      data: [],
      z: new Oscillator(model.calcOrderParamArg(), model.calcOrderParam(), 0)
    });
  }

  setN(N: number) {
    this.setState({
      model: new KuramotoModel(N, this.state.model.K),
    });
  }

  setK(K: number) {
    this.state.model.updateK(K);
    this.setState({
      model: this.state.model 
    });
  }
  
  update() {
    this.state.model.run();

    this.state.z.r = this.state.model.calcOrderParam();
    this.state.z.theta = this.state.model.calcOrderParamArg();

    this.setState({
      model: this.state.model,
      data: this.state.model.record_order_param,
      z: this.state.z
    });
  }

  drawOscillator(ctx: CanvasRenderingContext2D, oscillator: Oscillator) {
    let pos = oscillator.getPos();
    let x = this.center.x - this.radius * pos.x;
    let y = this.center.y - this.radius * pos.y;

//    let color = "rgba(38, 50, 56, 0)";
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2*Math.PI, false);
    ctx.stroke();
    ctx.closePath();
  }

  drawSync(ctx: CanvasRenderingContext2D, oscillator: Oscillator) {
    let pos = oscillator.getPos();
    let x = this.center.x - this.radius * pos.x;
    let y = this.center.y - this.radius * pos.y;


//    let color = "rgba(41, 98, 255, 1)";
    ctx.beginPath();
    ctx.moveTo(this.center.x, this.center.y);
//    ctx.strokeStyle = color;
//    ctx.fillStyle = color;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
//    ctx.strokeStyle = color;
//    ctx.fillStyle = color;
    ctx.arc(x, y, 10, 0, 2*Math.PI, false);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

  }

  componentDidMount() {
    const canvas: any = this.canvasRef.current;
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

    const w =  ctx.canvas.width
    const h =  ctx.canvas.height

    this.center = {
      x: w/2,
      y: h/2
    };


    this.radius = Math.min(this.center.x, this.center.y) - 20; 

    ctx.beginPath();
    ctx.arc(w/2, h/2, this.radius, 0, 2*Math.PI, false);
    ctx.stroke();

    for(let oscillator of this.state.model.oscillators) {
      this.drawOscillator(ctx, oscillator);
    }

    this.drawSync(ctx, this.state.z);

  }

  componentDidUpdate(prevProps: OscillatorProps, prevState: OscillatorState) {
    console.log(this.state);

    const canvas: any = this.canvasRef.current;
                      const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

    const w =  ctx.canvas.width
    const h =  ctx.canvas.height

    ctx.clearRect(0, 0, w, h);

    // 振動子の移動の軌跡
    this.center = {
      x: w/2,
      y: h/2
    };

    this.radius = Math.min(this.center.x, this.center.y) - 20; 

    ctx.beginPath();
    ctx.arc(w/2, h/2, this.radius, 0, 2*Math.PI, false);
    ctx.stroke();
    ctx.closePath();

    for(let oscillator of this.state.model.oscillators) {
      this.drawOscillator(ctx, oscillator);
    }

    this.drawSync(ctx, this.state.z);
  }

  render() {
    return (
      <div>
        <div className="columns">
          <div className="column">
            <canvas ref={this.canvasRef} width="300" height="300"/>
          </div>
          <div className="column">
            <LineChart
              width={500}
              height={400}
              data={Array.from(this.state.data)}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="iter" label={{ value: "時間 t", position: "insideBottomRight", dy: 10}} />
              <YAxis label={{ value: "z", position: "insideLeft", angle: -90,   dy: -10}} domain={[0, 1]} />
              <Tooltip />
              <Line type="monotone" dot={false} dataKey="order_param" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </div>
        </div>
      </div>
    );
  }

}

export default OscillatorViewer;
