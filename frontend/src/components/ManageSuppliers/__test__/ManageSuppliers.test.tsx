import React from 'react';
import ManageSuppliers from "..";
import { render, screen } from '@testing-library/react';

// check if the ManageSuppliers component renders without crashing
test('renders without crashing - ManageSuppliers', () => {
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
    }));
    render(<ManageSuppliers />);
    const linkElement = screen.getByText(/Add Supplier/i);
    expect(linkElement).toBeInTheDocument();
});
