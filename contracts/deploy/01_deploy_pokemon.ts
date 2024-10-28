import 'dotenv/config';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers } from 'hardhat';
import axios from 'axios';

const deployer: DeployFunction = async hre => {
    const { deploy } = hre.deployments;
    if (hre.network.config.chainId !== 31337) return;
    const { deployer, second } = await hre.getNamedAccounts();

    const mainDeployment = await deploy('Main', {
        from: deployer,
        log: true,
        gasLimit: 8000000
    });

    console.log("Main contract deployed to:", mainDeployment.address);

    const mainContract = await ethers.getContractAt('Main', mainDeployment.address);

    // Fonction pour récupérer des cartes Pokémon via l'API
    const getCardsFromAPI = async (page: number, pageSize: number) => {
        const response = await axios.get(`https://api.pokemontcg.io/v2/cards`, {
            params: {
                page: page,
                pageSize: pageSize
            },
            headers: {
                'X-Api-Key': 'df43d76a-6d3a-432b-8323-257b287e6c23'
            }
        });
        return response.data.data;
    };

    // Créer et remplir la première collection avec des cartes de l'API
    let collectionName = "Kanto Collection";
    let cardCount = 10; // Le nombre de cartes que tu veux pour la collection
    await mainContract.createCollection(collectionName, cardCount);

    const kantoCards = await getCardsFromAPI(1, cardCount); // Récupère 10 cartes depuis l'API
    for (let i = 0; i < kantoCards.length; i++) {
        const card = kantoCards[i];
        const imageUrl = card.images.large; // Utilise l'URL de l'image depuis l'API
        await mainContract.mintCardToCollection(0, deployer, imageUrl, i + 1); // Mint avec l'ID et l'image
    }

    collectionName = "Johto Collection";
    cardCount = 10; 
    await mainContract.createCollection(collectionName, cardCount);

    const johtoCards = await getCardsFromAPI(2, cardCount); 
    for (let i = 0; i < johtoCards.length; i++) {
        const card = johtoCards[i];
        const imageUrl = card.images.large;
        await mainContract.mintCardToCollection(1, second, imageUrl, i + 11); 
    }
};

export default deployer;
