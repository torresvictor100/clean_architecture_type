import CustomerFactory from "../../../domain/customer/factory/customer.factory";
import Address from "../../../domain/customer/value-object/address";
import ListCustomerUseCase from "./list.custome.usecase";

const customer1 = CustomerFactory.createWithAddress(
    "Jhon Doe",
    new Address("Street 1 ", 1, "12345", "city")
);

const customer2 = CustomerFactory.createWithAddress(
    "Jhon Doe",
    new Address("Street 2", 2, "123456", "City 2")
);

const MockRepository = () => {
    return {
    find: jest.fn(),
    findAll: jest.fn().mockReturnValue(Promise.resolve([customer1, customer2])),
    create: jest.fn(),
    update: jest.fn(),
    };
};

describe("Unit test for listing customer use case", () => {
    it("should list a customer", async () => {
        const repository = MockRepository();
        const useCase = new ListCustomerUseCase(repository);

        const output = await useCase.execute({});

        expect(output.customers.length).toEqual(2);
        expect(output.customers[0].id).toEqual(customer1.id);
        expect(output.customers[0].name).toEqual(customer1.name);
        expect(output.customers[0].address.street).toEqual(customer1.Address.street);
        expect(output.customers[0].address.city).toEqual(customer1.Address.city);
        expect(output.customers[0].address.zip).toEqual(customer1.Address.zip);
        expect(output.customers[0].address.number).toEqual(customer1.Address.number);


        expect(output.customers[1].id).toEqual(customer2.id);
        expect(output.customers[1].name).toEqual(customer2.name);
        expect(output.customers[1].address.street).toEqual(customer2.Address.street);
        expect(output.customers[1].address.city).toEqual(customer2.Address.city);
        expect(output.customers[1].address.zip).toEqual(customer2.Address.zip);
        expect(output.customers[1].address.number).toEqual(customer2.Address.number);
    });
});