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
}

interface CardItem {
    img: string;
    cardNumber: number;
    cardName: string;
    cardGid: number;
    onSell: boolean;
    cardOwner: string;
}

const Collections: React.FC<CollectionProps> = ({wallet}) => {
    const [collectionData, setCollectionData] = useState<CollectionItem[] | null>(null);
    const [walletAddress, setWalletAddress] = useState<string>("");
    useEffect(() => {
        if (wallet?.details.account) {
            setWalletAddress(wallet.details.account)
        }
    }, [wallet]);

    useEffect(() => {
        getCollections()
    }, []);

    const getCollections = () => {
        axios.get('http://localhost:3000/api/collections/get')
            .then((response) => {
                setCollectionData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }

    return (
        <div className="page-content">
            <h1>All Collections</h1>
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
                                                          cardData={card.cardGid}
                                                          onClickSell={() => {
                                                          }}
                                                          onClickBuy={() => {
                                                          }}
                                                          onSell={card.onSell}
                                                          isOwner={walletAddress === card.cardOwner} showButtons={false}
                                                          owner={walletAddress === card.cardOwner ? "you" : card.cardOwner.substring(0, 3) + ".." + card.cardOwner.substring(38)}
                                                    />
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

export default Collections;
