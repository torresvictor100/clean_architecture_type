import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {

    beforeEach(async () => {
        await sequelize.sync({force: true});
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {
        const response = await request(app)
        .post("/product")
        .send({
            name: "Product",
            price: 1,
        });

        expect(response.status).toBe(200);
        expect(response.body.name).toEqual("Product");
        expect(response.body.price).toEqual(1);
    });

    it("should not create a product", async () => {
        const response = await request(app)
        .post("/product")
        .send({
            name: "Product",
        });

        expect(response.status).toBe(500);
    });

    it("should not list all product", async () => {
        const listReponse = await request(app).get("/product").send();

        expect(listReponse.status).toBe(404);
    });

    it("should find a product", async () => {
        const product = await request(app)
        .post("/product")
        .send({
            name: "Product",
            price: 1,
        });

        expect(product.status).toBe(200);


        const response = await request(app).get(`/product/${product.body.id}`);
        expect(response.body.name).toEqual("Product");
        expect(response.body.price).toEqual(1);
    });

    it("should no find a product", async () => {

        const response = await request(app).get("/product/55");
    
        expect(response.status).toBe(500);
    });

    it("should update a product", async () => {

        const product = await request(app)
        .post("/product")
        .send({
            name: "Product",
            price: 1,
        });

        expect(product.status).toBe(200);

    const response = await request(app).put("/product/update").send({
        id: product.body.id,
        name:"ProductUpdate",
        price:2,
    });

    expect(response.status).toBe(200);
    expect(response.body.name).toEqual("ProductUpdate");
    expect(response.body.price).toEqual(2);
    });

    it("should no update a product", async () => {
        const response = await request(app).put("/product/update").send({});
        expect(response.status).toBe(500);
    });
});