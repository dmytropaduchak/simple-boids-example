import { FC, useEffect, useRef, useState } from 'react';
import { Button, ColorPicker, Popover, Slider } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import QueueAnim from 'rc-queue-anim';
import Texty from 'rc-texty';

interface Boid {
  x: number;
  y: number;
  s: number;
  i: number;
  vx: number;
  vy: number;
  bias: number;
  color: string;
}

export const Home: FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [boids, setBoids] = useState<Array<Boid>>([]);
  const [width, setWidth] = useState(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
  const [height, setHeight] = useState(window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);

  const [options, setOptions] = useState({
    color: '#454545',
    number: 610,
    turnFactor: 0.2,
    visualRange: 144,
    protectedRange: 233,
    centeringFactor: 0.005,
    avoidFactor: 0.05,
    matchingFactor: 0.05,
    maxSpeed: 6,
    minSpeed: 3,
    biasMax: 0.01,
    bias: 0.001,
    biasIncrement: 0.00004,
  });

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWidth(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
      setHeight(window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const radius = [1, 1, 2, 3, 5];
    const length = options.number/radius.length;
    setBoids(Array.from<unknown>({ length }).reduce<Boid[]>((accumulator) => {
      for (let j = 0; j < radius.length; j++) {
        const x = Math.floor(Math.random() * width);
        const y = Math.floor(Math.random() * height);
        const s = radius[j];
        const i = accumulator.length;
        const vx = options.minSpeed;
        const vy = options.minSpeed;
        const bias = options.bias;
        const color = options.color;
        accumulator.push({ i, x, y, s, vx, vy, bias, color });
      }
      return accumulator;
    }, []));
  }, [width, height, options]);

  useEffect(() => {
    const context = ref?.current?.getContext('2d');
    let animationFrame: number;

    if (context && boids.length) {
        const frameRequestCallback = () => {
          context.clearRect(0, 0, context.canvas.width, context.canvas.height);

          const offset = 55;
          const leftMargin = offset;
          const rightMargin = width-offset;
          const bottomMargin = height-offset;
          const topMargin = offset;

          boids.map((boid) => {
            let xPosAvg = 0
            let yPosAvg = 0 
            let xVelAvg = 0
            let yVelAvg = 0
            let xDisClose = 0
            let yDisClose = 0
            let neighboringBoids = 0;
        
            boids.forEach((otherBoid) => {
              const dx = boid.x - otherBoid.x;
              const dy = boid.y - otherBoid.y;
        
              if (Math.abs(dx) < options.visualRange && Math.abs(dy) < options.visualRange) {  
                const squaredDistance = dx * dx + dy * dy;
                if (squaredDistance < options.protectedRange) {
                  xDisClose += boid.x - otherBoid.x;
                  yDisClose += boid.y - otherBoid.y;
                } else if (squaredDistance < options.visualRange) {
                  xPosAvg += otherBoid.x;
                  yPosAvg += otherBoid.y;
                  xVelAvg += otherBoid.vx;
                  yVelAvg += otherBoid.vy;
                  neighboringBoids += 1;
                }
              }
            });
        
            if (neighboringBoids > 0) {
              xPosAvg = xPosAvg / neighboringBoids;
              yPosAvg = yPosAvg / neighboringBoids;
              xVelAvg = xVelAvg / neighboringBoids;
              yVelAvg = yVelAvg / neighboringBoids;
        
              boid.vx = (boid.vx + (xPosAvg - boid.x) * options.centeringFactor + (xVelAvg - boid.vx) * options.matchingFactor);
              boid.vy = (boid.vy + (yPosAvg - boid.y) * options.centeringFactor + (yVelAvg - boid.vy) * options.matchingFactor);
            }
        
            boid.vx = boid.vx + (xDisClose * options.avoidFactor);
            boid.vy = boid.vy + (yDisClose * options.avoidFactor);
        
            if (boid.x < leftMargin) {
              boid.vx = boid.vx + options.turnFactor;
            }
            if (boid.x > rightMargin) {
              boid.vx = boid.vx - options.turnFactor;
            }
            if (boid.y > bottomMargin) {
              boid.vy = boid.vy - options.turnFactor;
            }
            if (boid.y < topMargin) {
              boid.vy = boid.vy + options.turnFactor;
            }
                
            if (boid.i % 2 === 0) {
              if (boid.vx > 0) {
                boid.bias = Math.min(options.biasMax, boid.bias + options.biasIncrement);
              } else {
                boid.bias = Math.max(options.biasIncrement, boid.bias - options.biasIncrement);
              }
            } else if (boid.i % 2 !== 0) {
              if (boid.vx < 0) {
                boid.bias = Math.min(options.biasMax, boid.bias + options.biasIncrement);
              } else {
                boid.bias = Math.max(options.biasIncrement, boid.bias - options.biasIncrement);
              }
            }
        
            if (boid.i % 2 === 0) {
              boid.vx = (1 - boid.bias)*boid.vx + (boid.bias * 1);
            } else if (boid.i % 2 !== 0) {
              boid.vx = (1 - boid.bias)*boid.vx + (boid.bias * (-1));
            }
        
            const speed = Math.sqrt(boid.vx*boid.vx + boid.vy*boid.vy)
        
            if (speed < options.minSpeed) {
              boid.vx = (boid.vx/speed) * options.minSpeed;
              boid.vy = (boid.vy/speed) * options.minSpeed;
            }
            if (speed > options.maxSpeed) {
              boid.vx = (boid.vx/speed) * options.maxSpeed;
              boid.vy = (boid.vy/speed) * options.maxSpeed;
            }
            boid.x = boid.x + boid.vx;
            boid.y = boid.y + boid.vy;
            return { ...boid };
          }).forEach((i) => {
              context.beginPath();
              context.arc(i.x, i.y, i.s, 0, 2 * Math.PI);
              context.strokeStyle = options.color;
              context.stroke();
              context.closePath();
          });
          animationFrame = window.requestAnimationFrame(frameRequestCallback);
        };
        frameRequestCallback();
    }
    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [options, boids, width, height]);



  return (
    <div className="home" data-testid="home">
      <div style={{
        position: 'absolute',
        top: '28px',
        left: '28px',
        width: '510px',
      }}>
        <QueueAnim type="left" leaveReverse delay={100}>
          <div style={{
            fontSize: '74px',
            lineHeight: '0.8',
            textShadow: '1px 1px 6px white',
            textAlign: 'left',
          }}>
            <Texty type="alpha" mode="smooth" delay={100}>
              Simple Boids
            </Texty>
          </div>
          <div style={{
            fontSize: '18px',
            lineHeight: '1.5',
            textShadow: '1px 1px 3px white',
            textAlign: 'left',
          }}>
            <Texty key="2" type="alpha" mode="smooth" delay={100}>
              {"The simple artificial life program, developed by Craig Reynolds in 1986, which simulates the flocking behaviour of birds, and related group motion."}
            </Texty>
          </div>
        </QueueAnim>
      </div>
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '118px',
      }}>
        <Popover placement="bottomRight" content={(
          <div style={{ width: '240px', maxHeight: '520px', overflow: 'hidden', overflowY: 'auto' }}>
            <div style={{ padding: '0px 8px' }}>
              <h4 style={{ marginLeft: '2px', marginTop: '8px', marginBottom: '0px' }}>Color</h4>
              <ColorPicker showText defaultValue={options.color} value={options.color} onChange={(value) => {
                const color = value.toHexString();
                setOptions({ ...options, color });
              }}/>
            </div>
            <div style={{ padding: '0px 8px' }}>
              <h4 style={{ marginLeft: '2px', marginTop: '8px', marginBottom: '0px' }}>Number</h4>
              <Slider min={5} max={1000} step={1} defaultValue={options.number} value={options.number} onChange={(number) => {
                setOptions({ ...options, number });
              }}/>
            </div>
            <div style={{ padding: '0px 8px' }}>
              <h4 style={{ marginLeft: '2px', marginTop: '8px', marginBottom: '0px' }}>Turn Factor</h4>
              <Slider min={0.1} max={1} step={0.1} defaultValue={options.turnFactor} value={options.turnFactor} onChange={(turnFactor) => {
                setOptions({ ...options, turnFactor });
              }}/>
            </div>
            <div style={{ padding: '0px 8px' }}>
              <h4 style={{ marginLeft: '2px', marginTop: '8px', marginBottom: '0px' }}>Visual Range</h4>
              <Slider min={1} max={100} step={1} defaultValue={options.visualRange} value={options.visualRange} onChange={(visualRange) => {
                setOptions({ ...options, visualRange });
              }}/>
            </div>
            <div style={{ padding: '0px 8px' }}>
              <h4 style={{ marginLeft: '2px', marginTop: '8px', marginBottom: '0px' }}>Protected Range</h4>
              <Slider min={1} max={150} step={1} defaultValue={options.protectedRange} value={options.protectedRange} onChange={(protectedRange) => {
                setOptions({ ...options, protectedRange });
              }}/>
            </div>
            <div style={{ padding: '0px 8px' }}>
              <h4 style={{ marginLeft: '2px', marginTop: '8px', marginBottom: '0px' }}>Centering Factor</h4>
              <Slider min={0.001} max={0.01} step={0.001} defaultValue={options.centeringFactor} value={options.centeringFactor} onChange={(centeringFactor) => {
                setOptions({ ...options, centeringFactor });
              }}/>
            </div>
            <div style={{ padding: '0px 8px' }}>
              <h4 style={{ marginLeft: '2px', marginTop: '8px', marginBottom: '0px' }}>Avoid Factor</h4>
              <Slider min={0.01} max={0.1} step={0.01} defaultValue={options.avoidFactor} value={options.avoidFactor} onChange={(avoidFactor) => {
                setOptions({ ...options, avoidFactor });
              }}/>
            </div>
            <div style={{ padding: '0px 8px' }}>
              <h4 style={{ marginLeft: '2px', marginTop: '8px', marginBottom: '0px' }}>Matching Factor</h4>
              <Slider min={0.01} max={0.1} step={0.01} defaultValue={options.matchingFactor} value={options.matchingFactor} onChange={(matchingFactor) => {
                setOptions({ ...options, matchingFactor });
              }}/>
            </div>
            <div style={{ padding: '0px 8px' }}>
              <h4 style={{ marginLeft: '2px', marginTop: '8px', marginBottom: '0px' }}>Max Speed</h4>
              <Slider min={1} max={20} step={1} defaultValue={options.maxSpeed} value={options.maxSpeed} onChange={(maxSpeed) => {
                setOptions({ ...options, maxSpeed });
              }}/>
            </div>
            <div style={{ padding: '0px 8px' }}>
              <h4 style={{ marginLeft: '2px', marginTop: '8px', marginBottom: '0px' }}>Min Speed</h4>
              <Slider min={1} max={20} step={1} defaultValue={options.minSpeed} value={options.minSpeed} onChange={(minSpeed) => {
                setOptions({ ...options, minSpeed });
              }}/>
            </div>
            <div style={{ padding: '0px 8px' }}>
              <h4 style={{ marginLeft: '2px', marginTop: '8px', marginBottom: '0px' }}>Bias Max</h4>
              <Slider min={0.01} max={0.1} step={0.01} defaultValue={options.biasMax} value={options.biasMax} onChange={(biasMax) => {
                setOptions({ ...options, biasMax });
              }}/>
            </div>

            <div style={{ padding: '0px 8px' }}>
              <h4 style={{ marginLeft: '2px', marginTop: '8px', marginBottom: '0px' }}>Bias</h4>
              <Slider min={0.001} max={options.biasMax} step={0.001} defaultValue={options.bias} value={options.bias} onChange={(bias) => {
                setOptions({ ...options, bias });
              }}/>
            </div>

            <div style={{ padding: '0px 8px' }}>
              <h4 style={{ marginLeft: '2px', marginTop: '8px', marginBottom: '0px' }}>Bias Increment</h4>
              <Slider min={0.00001} max={0.0001} step={0.00001} defaultValue={options.biasIncrement} value={options.biasIncrement} onChange={(biasIncrement) => {
                setOptions({ ...options, biasIncrement });
              }} />
            </div>
          </div>
        )} trigger="click">
          <Button type="primary" shape="round" style={{ marginLeft: '8px' }} icon={<SettingOutlined />}>Setting</Button>
        </Popover>
      </div>
      <canvas ref={ref} width={width} height={height} />
    </div>
  )
}