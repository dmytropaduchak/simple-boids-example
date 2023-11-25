import { FC, Fragment, useEffect } from 'react';
import { Button, Col, Layout, Row, notification } from 'antd';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { GithubOutlined } from '@ant-design/icons';
import QueueAnim from 'rc-queue-anim';
import { Home } from '../home/home';
import { NotFound } from '../not-found/not-found';

const { Header, Content, Footer } = Layout;
const { PUBLIC_URL } = process.env;

export const App: FC = () => {
  useEffect(() => {
    notification.open({
      duration: 0,
      placement: 'bottomLeft',
      message: 'Github Help',
      description: (
        <Fragment>
          I need your support, please click the button to HELP
          <Button style={{ marginTop: '12px' }} type="default" shape="round" target="_blank" href="https://github.com/dmytropaduchak/simple-boids-example">Github</Button>
        </Fragment>
      )
    });
  
    notification.open({
      duration: 0,
      placement: 'bottomLeft',
      message: 'Find out how you can help.',
      description: (
        <Fragment>
          Simple Interpolation stands in solidarity with the Ukrainian people against the Russian invasion.
          <Button style={{ marginTop: '12px' }} type="default" shape="round" target="_blank" href="https://war.ukraine.ua/support-ukraine/">HELP UKRAINE</Button>
        </Fragment>
      )
    });
  }, []);

  return (
    <div className="app" data-testid="app">
      <Layout>
        <Header>
          <Row style={{
            margin: '0 auto',
            padding: '0 24px',
          }}>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="default" shape="round" target="_blank" ghost href="https://github.com/dmytropaduchak/simple-boids-example">Github</Button>
            </Col>
          </Row>
        </Header>
        <Content>
          <BrowserRouter basename={PUBLIC_URL}>
            <Routes>
              <Route index element={<Home />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to='/404' />} />
            </Routes>
          </BrowserRouter>
        </Content>
        <Footer>
          <Row style={{
            margin: '0 auto',
            padding: '0 24px',
          }}>
            <Col xs={24} md={12} style={{ textAlign: 'left' }}>
              <QueueAnim type="left" leaveReverse delay={100}>
                <Button href="https://dmytropaduchak.github.io/simple-boids-example/" type="link">{`Copyright © ${(new Date()).getFullYear()} Simple Boids Example`}</Button>
              </QueueAnim>
            </Col>
            <Col xs={24} md={12} style={{ textAlign: 'right' }}>
              <QueueAnim type="right" leaveReverse delay={100}>
                <Button href="https://github.com/dmytropaduchak" type="link" target="_blank" icon={<GithubOutlined />}>Dmytro Paduchak</Button>
              </QueueAnim>
            </Col>
          </Row>
        </Footer>
      </Layout>
    </div>
  );
}
