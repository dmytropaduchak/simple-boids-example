import '@testing-library/jest-dom';
import { screen, render } from '@testing-library/react';
import { Home } from './home';

jest.mock('antd');
jest.mock('@ant-design/icons');
jest.mock('rc-queue-anim');
jest.mock('rc-texty');

describe('/src/home/home.tsx', () => {
  it('should be render', () => {
    render(<Home />);
    const element = screen.getByTestId('home');
    expect(element).toBeInTheDocument();
  });
})
