import express, {Request, Response, Router} from 'express';
import fetch from 'node-fetch';
const apiUrl = 'https://api.pokemontcg.io/v2/cards.json';
const cardRouter: Router = express.Router();


cardRouter.get('/getInfo/:gid', async (req: Request, res: Response) => {
    const targetGid = req.params;
    console.log(targetGid)
    try {
        const response = await fetch(apiUrl);
        const jsonData = await response.json(); 
        const cards = jsonData.data; 

        const card = cards.find((card: any) => card.id === "hgss4-1");
        if (card) {
            res.json(card); 
        } else {
            res.status(404).json({ message: 'Card not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching card information', error });
    }
});

export default cardRouter