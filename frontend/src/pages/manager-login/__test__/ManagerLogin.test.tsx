import React from 'react';
import { render, screen } from '@testing-library/react';
import ManagerLogin from '..';

// check if the ManagerLogin component renders without crashing
test('renders without crashing - ManagerLogin', () => {
    render(<ManagerLogin />);
    const linkElement = screen.getByText(/Manager Login/i);
    expect(linkElement).toBeInTheDocument();
});