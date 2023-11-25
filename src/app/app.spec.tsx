import '@testing-library/jest-dom';
import { screen, render } from '@testing-library/react';
import { App } from './app';

jest.mock('antd');
jest.mock('react-router-dom');
jest.mock('@ant-design/icons');
jest.mock('rc-queue-anim');
jest.mock('../home/home');
jest.mock('../not-found/not-found');

describe('/src/app/app.tsx', () => {
  it('should be render', () => {
    render(<App />);
    const element = screen.getByTestId('app');
    expect(element).toBeInTheDocument();
  });
})
