import React, {useEffect, useState} from 'react';
import axios from 'axios';
import '../css/Collections.css'
import Card from "@/components/Card";

interface CollectionProps {
    wallet: any
}

interface CollectionItem {
    collectionId: number;
    collectionName: string;
    cardCount: number;
    cards: CardItem[];
    redeemed: boolean;
    owner: string;
}

interface CardItem {
    img: string;
    cardNumber: number;
    cardGid: number;
    onSell: boolean;
    cardOwner: string;
}

const UserCollections: React.FC<CollectionProps> = ({wallet}) => {
    const [collectionData, setCollectionData] = useState<CollectionItem[] | null>(null);
    const [walletAddress, setWalletAddress] = useState<string>("");

    useEffect(() => {
        if (wallet?.details.account) {
            getCollections()
            setWalletAddress(wallet.details.account)
        }
    }, [wallet]);

    const sellCard = async (collectionId: number, tokenId: number) => {
        if (wallet?.contract) {
            const sell = await wallet.contract.listCard(collectionId, tokenId);
            sell.wait().then(getCollections)
        }

    };

    const getCollections = () => {
        // Ensure wallet and wallet.details.account are defined
        axios
            .get(`http://localhost:3000/api/collections/getFor/${wallet.details.account}`)
            .then((response) => {
                setCollectionData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }

    return (
        <div className="page-content">
            <h1>My Collections</h1>
            {collectionData === null ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="collection">
                    <div className="collection-left">
                        <ul>
                            {collectionData.filter((item) => item.redeemed).map((item) => (
                                <li key={item.collectionId}>
                                    <a href={`#${item.collectionId}`}>{item.collectionName}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="collection-right">
                        {collectionData.filter((item) => item.redeemed).map((item) => (
                            <div key={item.collectionId} id={`${item.collectionId}`}>
                                <div className="collection-title">
                                    <span className="collection-count">{item.cardCount}</span>
                                    <span className="collection-name">{item.collectionName} </span>
                                </div>
                                <div className="collection-block">
                                    {
                                        item.cards
                                            .filter((card) => card.img)
                                            .map((card) =>
                                                (
                                                    <Card key={card.cardNumber} imageUrl={card.img}
                                                          onClickSell={() => sellCard(item.collectionId, card.cardNumber)}
                                                          onClickBuy={() => {
                                                          }}
                                                          cardData={card.cardGid} onSell={card.onSell} isOwner={true}
                                                          showButtons={true}
                                                          owner={walletAddress.substring(0, 3) + "..." + walletAddress.substring(38)}/>
                                                )
                                            )
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserCollections;
