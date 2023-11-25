import '@testing-library/jest-dom';
import { screen, render } from '@testing-library/react';
import { NotFound } from './not-found';

jest.mock('antd');
jest.mock('rc-queue-anim');
jest.mock('rc-texty');

describe('/src/not-found/not-found.tsx', () => {
  it('should be render', () => {
    render(<NotFound />);
    const element = screen.getByTestId('not-found');
    expect(element).toBeInTheDocument();
  });
})
