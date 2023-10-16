// import { insertManager } from "../../api/controllers/Manager.controller";
import {
  insertManager,
  getAllManager,
  getManagerById,
  updateManagerById,
  deleteManagerById,
  loginManager 
} from "../../api/services/Manager.service";
import ManagerModel from "../../api/models/Manager.model";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// mocking data
jest.mock("../../api/models/Manager.model");
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');


const userObject = {
  name: "fake_name",
  phone: "0712906815",
  email: "test@gmail.com",
  password: "$2a$10$EPK63F2vsrRRgAmxhW6Ck.YIBdMWW3r793vYXhzqJm5PR4Tv2a5w6",
  role: "Manager",
};

it("Should  send a error when user exist", async () => {
  ManagerModel.findOne.mockImplementationOnce(() => ({
    name: "User",
    phone: "0712906815",
    email: "test@gmail.com",
    password: "$2a$10$EPK63F2vsrRRgAmxhW6Ck.YIBdMWW3r793vYXhzqJm5PR4Tv2a5w6",
    role: "MANAGER",
  }));
  await expect(insertManager(userObject)).rejects.toThrow(
    "Email already exists"
  );
});

// it('Should return the created user data when user is successfully created', async () => {
//     const createdUser = {
//         _id: "some_unique_id",
//         name: userObject.name,
//         phone: userObject.phone,
//         email: userObject.email,
//         role: userObject.role,
//     };

//     ManagerModel.findOne.mockResolvedValueOnce(null); // Simulating user does not exist initially
//     ManagerModel.prototype.save.mockResolvedValueOnce(createdUser); // Mocking the save method of the model instance

//     const result = await insertManager(userObject);

//     // Ensure the model instance's save method is called with the correct arguments
//     expect(ManagerModel.prototype.save).toHaveBeenCalledWith();

//     // Ensure the returned data matches the created user object
//     expect(result).toEqual(createdUser);
// });

describe("getAllManager function", () => {
  it("should return all managers when data is retrieved successfully", async () => {
    const mockManagerData = [
      { _id: "1", name: "Manager 1", email: "manager1@example.com" },
      { _id: "2", name: "Manager 2", email: "manager2@example.com" },
    ];

    ManagerModel.find.mockResolvedValueOnce(mockManagerData);

    const result = await getAllManager();
    expect(result).toEqual(mockManagerData);
  });

  it("should throw an error when there is an error in data retrieval", async () => {
    const errorMessage = "Error retrieving data";
    ManagerModel.find.mockRejectedValueOnce(new Error(errorMessage));

    await expect(getAllManager()).rejects.toThrow(errorMessage);
  });
});

describe("getManagerById function", () => {
  it("should return manager when manager is found", async () => {
    const mockManagerData = {
      _id: "1",
      name: "Manager 1",
      email: "manager1@example.com",
    };

    ManagerModel.findById.mockResolvedValueOnce(mockManagerData);

    const result = await getManagerById("1");
    expect(result).toEqual(mockManagerData);
  });

  it("should throw an error when manager is not found", async () => {
    ManagerModel.findById.mockResolvedValueOnce(null);

    await expect(getManagerById("1")).rejects.toThrow("Manager not found");
  });

  it("should throw an error when there is an error during retrieval", async () => {
    const errorMessage = "Error retrieving manager";
    ManagerModel.findById.mockRejectedValueOnce(new Error(errorMessage));

    await expect(getManagerById("1")).rejects.toThrow(errorMessage);
  });
});

describe("updateManagerById function", () => {
  it("should return updated manager when manager is successfully updated", async () => {
    const mockManagerData = {
      _id: "1",
      name: "Updated Manager",
      email: "updatedmanager@example.com",
    };

    ManagerModel.findByIdAndUpdate.mockResolvedValueOnce(mockManagerData);

    const result = await updateManagerById("1", {
      name: "Updated Manager",
      email: "updatedmanager@example.com",
    });
    expect(result).toEqual(mockManagerData);
  });

  it("should throw an error when manager is not found", async () => {
    ManagerModel.findByIdAndUpdate.mockResolvedValueOnce(null);

    await expect(
      updateManagerById("1", {
        name: "Updated Manager",
        email: "updatedmanager@example.com",
      })
    ).rejects.toThrow("Manager not found");
  });

  it("should throw an error when there is an error during update", async () => {
    const errorMessage = "Error updating manager";
    ManagerModel.findByIdAndUpdate.mockRejectedValueOnce(
      new Error(errorMessage)
    );

    await expect(
      updateManagerById("1", {
        name: "Updated Manager",
        email: "updatedmanager@example.com",
      })
    ).rejects.toThrow(errorMessage);
  });
});

describe("deleteManagerById function", () => {
  it("should return deleted manager when manager is successfully deleted", async () => {
    const mockManagerData = {
      _id: "1",
      name: "Deleted Manager",
      email: "deletedmanager@example.com",
    };

    ManagerModel.findByIdAndDelete.mockResolvedValueOnce(mockManagerData);

    const result = await deleteManagerById("1");
    expect(result).toEqual(mockManagerData);
  });

  it("should throw an error when manager is not found", async () => {
    ManagerModel.findByIdAndDelete.mockResolvedValueOnce(null);

    await expect(deleteManagerById("1")).rejects.toThrow("Manager not found");
  });

  it("should throw an error when there is an error during deletion", async () => {
    const errorMessage = "Error deleting manager";
    ManagerModel.findByIdAndDelete.mockRejectedValueOnce(
      new Error(errorMessage)
    );

    await expect(deleteManagerById("1")).rejects.toThrow(errorMessage);
  });
});


describe('loginManager function', () => {
    it('should return a response object with access token when login is successful', async () => {
        const mockManagerData = {
            _id: '1',
            name: 'Manager 1',
            email: 'manager1@example.com',
            password: '$2a$10$EPK63F2vsrRRgAmxhW6Ck.YIBdMWW3r793vYXhzqJm5PR4Tv2a5w6', // hashed password
            role: 'Manager',
        };

        const mockAccessToken = 'mockAccessToken';

        ManagerModel.findOne.mockResolvedValueOnce(mockManagerData);
        bcrypt.compareSync.mockReturnValueOnce(true);
        jwt.sign.mockReturnValueOnce(mockAccessToken);

        const result = await loginManager('manager1@example.com', 'password');
        const expectedResponse = {
            _id: mockManagerData._id,
            name: mockManagerData.name,
            phone: mockManagerData.phone,
            email: mockManagerData.email,
            role: mockManagerData.role,
            accessToken: mockAccessToken,
        };

        expect(result).toEqual(expectedResponse);
    });

    it('should throw an error when login credentials are invalid', async () => {
        const mockManagerData = {
            _id: '1',
            name: 'Manager 1',
            email: 'manager1@example.com',
            password: '$2a$10$EPK63F2vsrRRgAmxhW6Ck.YIBdMWW3r793vYXhzqJm5PR4Tv2a5w6', // hashed password
            role: 'Manager',
        };

        ManagerModel.findOne.mockResolvedValueOnce(mockManagerData);
        bcrypt.compareSync.mockReturnValueOnce(false);

        await expect(loginManager('manager1@example.com', 'wrongpassword')).rejects.toThrow("Invalid Login Credentials");
    });

    it('should throw an error when there is an error during login process', async () => {
        const errorMessage = 'Error during login process';
        ManagerModel.findOne.mockRejectedValueOnce(new Error(errorMessage));

        await expect(loginManager('manager1@example.com', 'password')).rejects.toThrow(errorMessage);
    });
});