import ManageSuppliers from "..";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// check if the ManageSuppliers component renders without crashing
test("renders without crashing - ManageSuppliers", () => {
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
  render(<ManageSuppliers />);
  const linkElement = screen.getByText(/Add Supplier/i);
  expect(linkElement).toBeInTheDocument();
});

describe("ManageSuppliers Component", () => {
  it("renders loading message initially", () => {
    render(<ManageSuppliers />);
    const loadingMessage = screen.getByText("Loading");
    expect(loadingMessage).toBeInTheDocument();
  });

  it("renders table headers", async () => {
    render(<ManageSuppliers />);
    await waitFor(() => {
      const headers = screen.getAllByRole("columnheader");
      expect(headers).toHaveLength(6); // Assuming you have 6 columns in your table
    });
  });

  it("renders rows with edit and delete buttons", async () => {
    render(<ManageSuppliers />);
    await waitFor(() => {
      const editButtons = screen.getAllByText("Edit");
      const deleteButtons = screen.getAllByText("Delete");
      expect(editButtons).toHaveLength(5);
      expect(deleteButtons).toHaveLength(5);//by assuming table have only 5 records
    });
  });

  it("opens edit modal when edit button is clicked", async () => {
    render(<ManageSuppliers />);
    await waitFor(() => {
      const editButton = screen.getByText("Edit");
      fireEvent.click(editButton);
      const editModal = screen.getByText("Edit supplier Record");
      expect(editModal).toBeInTheDocument();
    });
  });


});
