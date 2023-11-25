import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Button, Row, Col } from 'antd';
import QueueAnim from 'rc-queue-anim';
import Texty from 'rc-texty';

export const NotFound: FC = () => (
  <div className="not-found" data-testid="not-found">
    <Row align="middle" justify="center">
      <Col xs={24} md={12}>
        <QueueAnim type="left" leaveReverse delay={100}>
          <div style={{
            fontSize: '74px',
            lineHeight: '0.8',
            textShadow: '1px 1px 6px white',
            textAlign: 'right',
          }}>
            <Texty key="1" type="alpha" mode="smooth" delay={100}>
              404
            </Texty>
          </div>
        </QueueAnim>
      </Col>
      <Col xs={24} md={12}>
        <QueueAnim type="right" leaveReverse delay={100}>
          <div style={{
            fontSize: '18px',
            lineHeight: '1.5',
            textShadow: '1px 1px 3px white',
            textAlign: 'left',
            marginLeft: '16px'
          }}>
            <Texty key="2" type="alpha" mode="smooth" delay={100}>
              {"Sorry, the page could not be found"}
            </Texty>
            <Button type="primary" shape="round" ghost style={{
              marginTop: '6px'
            }}><Link key="3" to="/">Go Home</Link></Button>
          </div>
          
        </QueueAnim>
      </Col>
    </Row>
  </div>
);
