import ProductFactory from "../../../domain/product/factory/product.factory";
import UpdateProductUseCase from "./update.product.usecase";


const product = ProductFactory.createProduct("Name", 1);

const input = {
    id: product.id,
    name: "Name update",
    price: 2,
}


const MockRepository = () => {
    return {
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    };
};

describe("Unit test for product update use case", () => {
    it("should update a product", async () => {
        const productRepository = MockRepository();
        const productUpdateUseCase = new UpdateProductUseCase(productRepository);

        const output = await productUpdateUseCase.execute(input);

        expect(output).toEqual(input);
    })
});