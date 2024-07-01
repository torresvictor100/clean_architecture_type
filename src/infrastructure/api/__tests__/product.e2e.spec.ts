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

    it("should list all product", async () => {

        const response1 = await request(app)
        .post("/product")
        .send({
            name: "Product1",
            price: 1,
        });

        expect(response1.status).toBe(200);


        const response2 = await request(app)
        .post("/product")
        .send({
            name: "Product2",
            price: 2,
        });

        expect(response1.status).toBe(200);
        const listReponse = await request(app).get("/product").send();

        expect(listReponse.status).toBe(200);

        const product1 = listReponse.body.products[0];
        expect(product1.name).toEqual("Product1");

        const product2 = listReponse.body.products[1];
        expect(product2.name).toEqual("Product2");


        const listResponseXML = await request(app)
        .get("/product")
        .set("Accept", "application/xml")
        .send();

        expect(listResponseXML.status).toBe(200);
        expect(listResponseXML.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
        expect(listResponseXML.text).toContain(`<products>`);
        expect(listResponseXML.text).toContain(`<product>`);
        expect(listResponseXML.text).toContain(`<name>Product1</name>`);
        expect(listResponseXML.text).toContain(`<price>1</price>`);
        expect(listResponseXML.text).toContain(`<product>`);
        expect(listResponseXML.text).toContain(`<name>Product2</name>`);
        expect(listResponseXML.text).toContain(`<price>2</price>`);
    });


    it("should list all product", async () => {
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