import express, {Request, Response, Router} from 'express';
import * as main from "../contract";
import {img} from "../boosterImages";

const boostersRouter: Router = express.Router();

function getBoosterCards() {
    const copyArr = [...img];
    for (let i = copyArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copyArr[i], copyArr[j]] = [copyArr[j], copyArr[i]];
    }

    return copyArr.slice(0, 5);
}

async function getBoosters(user: string) {
    const contract = await main.init()
    const boosters = await contract.getCollectionsAndCards(false, true, user)
    return boosters.filter((collection) => collection.owner === user)
        .map((collection: any) => {
            return {
                boosterId: collection[0].toNumber(),
                boosterName: collection[1] + "-" + collection[0].toNumber(),
                boosterCardCount: collection[2],
                cards: collection[3].map((card: any) => {
                    return {
                        img: card[0],
                        cardNumber: card[1].toNumber(),
                        cardGid: card[2].toNumber(),
                        onSell: card[3],
                        cardOwner: card[4]
                    };
                }),
                redeemed: collection[4],
                owner: collection[5]
            };
        })
}


boostersRouter.get('/get/:address', async (req: Request, res: Response) => {
    const user = req.params.address;
    try {
        const mes = await getBoosters(user);
        res.json(mes);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'An error occurred'});
    }
});


boostersRouter.get('/redeem', (req: Request, res: Response) => {

    try {
        const mes = getBoosterCards();
        res.json(mes);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'An error occurred'});
    }
});

export default boostersRouter;
