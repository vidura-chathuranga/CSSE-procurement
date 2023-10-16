import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';


import {
  ManagerSidebar,
  ManagerDashboard,
  ManageSiteManagers,
  ManageSites,
  ManageOrders,
  ManageProducts,
  ManagerSettings,
  ManageSuppliers,
} from './components';
 
// check if the App component renders without crashing
test('renders without crashing - app', () => {
  render(<App />);
  const linkElement = screen.getByText(/Manager Login/i);
  expect(linkElement).toBeInTheDocument();
});

// check if the ManagerSidebar component renders without crashing
test('renders without crashing - ManagerSidebar', () => {
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
  render(<ManagerSidebar />);
  const linkElement = screen.getByText(/v1.0.0/i);
  expect(linkElement).toBeInTheDocument();
});

// check if the ManagerDashboard component renders without crashing
test('renders without crashing - ManagerDashboard', () => {
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
  render(<ManagerDashboard />);
  const linkElement = screen.getByText(/Recent Orders/i);
  expect(linkElement).toBeInTheDocument();
});

// check if the ManageSiteManagers component renders without crashing
test('renders without crashing - ManageSiteManagers', () => {
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
  render(<ManageSiteManagers />);
  const linkElement = screen.getByText(/Add manager/i);
  expect(linkElement).toBeInTheDocument();
});

// check if the ManageSites component renders without crashing
test('renders without crashing - ManageSites', () => {
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
  render(<ManageSites />);
  const linkElement = screen.getByText(/Add site/i);
  expect(linkElement).toBeInTheDocument();
});                   

// check if the ManageOrders component renders without crashing
test('renders without crashing - ManageOrders', () => {
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
  render(<ManageOrders />);
  const linkElement = screen.getByText(/Add order/i);
  expect(linkElement).toBeInTheDocument();
});

// check if the ManageProducts component renders without crashing
test('renders without crashing - ManageProducts', () => {
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
  render(<ManageProducts />);
  const linkElement = screen.getByText(/Add product/i);
  expect(linkElement).toBeInTheDocument();
});

// check if the ManagerSettings component renders without crashing
test('renders without crashing - ManagerSettings', () => {
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
  render(<ManagerSettings />);
  const linkElement = screen.getByText(/Manager Settings/i);
  expect(linkElement).toBeInTheDocument();
});

// check if the ManageSuppliers component renders without crashing
test('renders without crashing - ManageSuppliers', () => {
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
  render(<ManageSuppliers />);
  const linkElement = screen.getByText(/Add supplier/i);
  expect(linkElement).toBeInTheDocument();
});