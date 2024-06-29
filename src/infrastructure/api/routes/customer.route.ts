
import express, {Request, Response} from "express";
import CreateCustomerUseCase from "../../../usecase/customer/create/create.customer.usecase";
import CustomerRepository from "../../customer/repository/sequelize/customer.repository";
import ListCustomerUseCase from "../../../usecase/customer/list/list.custome.usecase";
import FindCustomerUseCase from "../../../usecase/customer/find/find.customer.usecase";
import UpdateCustomeUseCase from "../../../usecase/customer/update/update.customer.usecase";

export const customerRouter = express.Router();

customerRouter.post('/', async (req: Request, res: Response) => {
    const usecase = new CreateCustomerUseCase(new CustomerRepository());

    try {
        const customerDto = {
            name: req.body.name,
            address: {
                street: req.body.address.street,
                city: req.body.address.city,
                number: req.body.address.number,
                zip: req.body.address.zip,
            }
        }

        const output = await usecase.execute(customerDto);
        res.send(output);
    }catch(err){
        res.status(500).send(err);
    }
});


customerRouter.get('/', async (req: Request, res: Response) => {
    const usecase = new ListCustomerUseCase(new CustomerRepository());

    try{
        const output = await usecase.execute({});

        if (output.customers.length === 0) {
            res.sendStatus(404);
        } else {
            res.send(output);
        }

    }catch(err){
        res.send(500).send(err);
    }
});


customerRouter.get('/find/', async (req: Request, res: Response) => {
    const usecase = new FindCustomerUseCase(new CustomerRepository());

    try {
        const output = await usecase.execute(req.body);

        res.send(output);


    } catch (err) {
        res.status(500).send(err);
    }


    customerRouter.get('/update/', async (req: Request, res: Response) => {
        const usecase = new UpdateCustomeUseCase(new CustomerRepository());

    try {

        const customerDto = {
            id: req.body.id,
            name: req.body.name,
            address: {
                street: req.body.address.street,
                city: req.body.address.city,
                number: req.body.address.number,
                zip: req.body.address.zip,
            }
        }

        const output = await usecase.execute(customerDto);
        res.send(output);

    }catch (err) {
        res.status(500).send(err);
    }
    });
});
