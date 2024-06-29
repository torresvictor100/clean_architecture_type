import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for customer", () => {
    beforeEach(async () => {
        await sequelize.sync({force: true});
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a customers", async () => {
        const response = await request(app)
        .post("/customer")
        .send({
            name: "Jhon",
            address: {
                street: "Street",
                city: "City",
                number:123,
                zip: "12345",
            },
        });

        expect(response.status).toBe(200);
        expect(response.body.name).toEqual("Jhon");
        expect(response.body.address.city).toEqual("City");
        expect(response.body.address.street).toEqual("Street");
        expect(response.body.address.number).toEqual(123);
        expect(response.body.address.zip).toEqual("12345");
    });

    it("should not create a customer", async () => {
        const response = await request(app)
        .post("/customer")
        .send({
            name: "Jhon",
        });

        expect(response.status).toBe(500);
    });

    it("should list all customer", async () => {
        const response = await request(app)
        .post("/customer")
        .send({
            name: "Jhon",
            address: {
                street: "Street",
                city: "City",
                number:123,
                zip: "12345",
            },
        });

        expect(response.status).toBe(200);

        const response2 = await request(app)
        .post("/customer")
        .send({
            name: "Jhon2",
            address: {
                street: "Street2",
                city: "City2",
                number:1234,
                zip: "123456",
            },
        });

        expect(response2.status).toBe(200);

        const listReponse = await request(app).get("/customer").send();

        expect(listReponse.status).toBe(200);
        expect(listReponse.body.customers.length).toBe(2);

        const customer = listReponse.body.customers[0];
        expect(customer.name).toEqual("Jhon");
        expect(customer.address.city).toEqual("City");
        expect(customer.address.street).toEqual("Street");
        expect(customer.address.number).toEqual(123);
        expect(customer.address.zip).toEqual("12345");

        const customer2 = listReponse.body.customers[1];
        expect(customer2.name).toEqual("Jhon2");
        expect(customer2.address.city).toEqual("City2");
        expect(customer2.address.street).toEqual("Street2");
        expect(customer2.address.number).toEqual(1234);
        expect(customer2.address.zip).toEqual("123456");

    });


    it("should not list all customer", async () => {
        const listReponse = await request(app).get("/customer").send();

        expect(listReponse.status).toBe(404);
    });


    it("should find a customer", async () => {
        const customer = await request(app)
            .post("/customer")
            .send({
                name: "Jhon",
                address: {
                    street: "Street",
                    city: "City",
                    number: 123,
                    zip: "12345",
                },
            });
    
        expect(customer.status).toBe(200);

        const response = await request(app).get(`/customer/${customer.body.id}`);
    
        expect(response.status).toBe(200);
        expect(response.body.name).toEqual("Jhon");
        expect(response.body.address.city).toEqual("City");
        expect(response.body.address.street).toEqual("Street");
        expect(response.body.address.number).toEqual(123);
        expect(response.body.address.zip).toEqual("12345");
    });

    it("should no find a customer", async () => {

        const response = await request(app).get("/customer/55");
    
        expect(response.status).toBe(500);
    });


    it("should update a customer", async () => {

        const customer = await request(app)
        .post("/customer")
        .send({
            name: "Jhon",
            address: {
                street: "Street",
                city: "City",
                number: 123,
                zip: "12345",
            },
        });

    expect(customer.status).toBe(200);

    const response = await request(app).put("/customer/update").send({
        id: customer.body.id,
        name:"JhonUpdate",
        address: {
            street: "StreetUpdate",
            city: "CityUpdate",
            number: 1234,
            zip: "123456",
        }
    });

    expect(response.status).toBe(200);
    expect(response.body.name).toEqual("JhonUpdate");
    expect(response.body.address.city).toEqual("CityUpdate");
    expect(response.body.address.street).toEqual("StreetUpdate");
    expect(response.body.address.number).toEqual(1234);
    expect(response.body.address.zip).toEqual("123456");

    });

    it("should no update a customer", async () => {
        const response = await request(app).put("/customer/update").send({});
        expect(response.status).toBe(500);
    });
});
