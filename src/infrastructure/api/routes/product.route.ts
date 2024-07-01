import express, {Request, Response} from "express";
import CreateProductUseCase from "../../../usecase/product/create/create.product.usecase";
import ProductRepository from "../../product/repository/sequelize/product.repository";
import ListProductUseCase from "../../../usecase/product/list/list.product.usecase";
import FindProductUseCase from "../../../usecase/product/find/find.product.usecase";
import UpdateProductUseCase from "../../../usecase/product/update/update.product.usecase";
import ProductPresenter from "../presenters/product.presenter";

export const productRouter = express.Router();

productRouter.post('/', async (req: Request, res: Response) => {
    const usecase = new CreateProductUseCase(new ProductRepository);

    try {
        const productDto = {
            name: req.body.name,
            price: req.body.price,
        }

        const output = await usecase.execute(productDto);
        res.send(output);
    }catch(err){
        res.status(500).send(err);
    }
});

productRouter.get('/', async (req:Request, res: Response) => {
    const usecase = new ListProductUseCase(new ProductRepository);

    try{
        const output = await usecase.execute({});

        if (output.products.length === 0) {
            res.sendStatus(404);
        } else {
            res.format({
                json: async () => res.send(output),
                xml: async () => res.send(ProductPresenter.listXML(output)),
            })
        }

    }catch(err){
        res.send(500).send(err);
    }
});

productRouter.get('/:id', async (req: Request, res: Response) => {
    const usecase = new FindProductUseCase(new ProductRepository);

    try {
        const id = req.params.id;

        const output = await usecase.execute({
            id:id,
        });

        res.send(output);


    } catch (err) {
        res.status(500).send(err);
    }
});


productRouter.put('/update/', async (req: Request, res: Response) => {
    const usecase = new UpdateProductUseCase(new ProductRepository);

    try {
        const productDto = {
            id: req.body.id,
            name: req.body.name,
            price: req.body.price,
        }

        const output = await usecase.execute(productDto);
        res.send(output);

    }catch(err){
        res.status(500).send(err);
    }
});