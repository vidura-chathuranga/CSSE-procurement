import OrderModel from "../../api/models/Order.model";

// mocking data
jest.mock("../../api/models/Order.model");

describe("insertOrder function", () => {
  it("should return the created order when order is successfully inserted", async () => {
    const orderData = {
      // Order data fields
    };

    const mockOrder = {
      product: "652d3528221c68e66738b951",
      quantity: 2,
      deliveryDate: "2023-12-25T00:00:00.000Z",
      site: "652d358d221c68e66738b98d",
      status: "placed",
      specialNotes: "Test",
      updatedBy: "652d32880f776acbda25065a",
    };

    OrderModel.create.mockResolvedValueOnce(mockOrder);
    const saveSpy = jest.spyOn(OrderModel.prototype, "save");

    const result = await insertOrder(orderData);

    expect(OrderModel.create).toHaveBeenCalledWith(orderData);
    expect(saveSpy).toHaveBeenCalled();
    expect(result).toEqual(mockOrder);
  });

  it("should throw an error when there is an error during order insertion", async () => {
    const orderData = {
        product: "652d3528221c68e66738b951",
        quantity: 2,
        deliveryDate: "2023-12-25T00:00:00.000Z",
        site: "652d358d221c68e66738b98d",
        status: "placed",
        specialNotes: "Test",
        updatedBy: "652d32880f776acbda25065a",
    };

    const errorMessage = "Error inserting order";
    OrderModel.create.mockRejectedValueOnce(new Error(errorMessage));

    await expect(insertOrder(orderData)).rejects.toThrow(errorMessage);
  });
});
