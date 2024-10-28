import React, {useEffect, useState} from 'react';
import axios from 'axios';
import '../css/Boosters.css'
import Card from "@/components/Card";
import boosterImg from '../img/booster.jpg';

interface BoosterProps {
    wallet: any
}

interface BoosterItem {
    boosterId: number;
    boosterName: string;
    cards: CardItem[];
    redeemed: boolean;
}

interface CardItem {
    img: string;
    cardNumber: number;
    cardGid: number;
    onSell: boolean;
}

const UserBoosters: React.FC<BoosterProps> = ({wallet}) => {
    const [boosterData, setBoosterData] = useState<BoosterItem[] | null>(null);
    const [walletAddress, setWalletAddress] = useState<string>("");

    useEffect(() => {
        if (wallet?.details.account) {
            getBoosters()
            setWalletAddress(wallet.details.account)
        }
    }, [wallet]);

    const getBoosters = () => {
        console.log("gggggggg")
        console.log(wallet.details.account)
        axios
            .get(`http://localhost:3000/api/boosters/get/${wallet.details.account}`)
            .then((response) => {
                setBoosterData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }
    const createBooster = async () => {
        if (wallet?.contract) {
            const booster = await wallet.contract.createBooster();
            booster?.wait().then(getBoosters)
        }
    };

    const redeemBooster = async (boosterId: number) => {
        axios
            .get(`http://localhost:3000/api/boosters/redeem`)
            .then(async (response) => {
                const cards = response.data
                if (wallet?.contract && cards) {
                    const booster = await wallet.contract.redeemBooster(boosterId, cards);
                    booster?.wait().then(getBoosters)
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });

    };

    const sellCard = async (collectionId: number, tokenId: number) => {
        if (wallet?.contract) {
            const sell = await wallet.contract.listCard(collectionId, tokenId);
            sell.wait().then(getBoosters)
        }

    };

    return (
        <div className="page-content">
            <div className="boosters-head">
                <h1>My Boosters</h1>
                <button onClick={createBooster}>Create booster</button>
            </div>
            <div className="not-redeemed">
                {boosterData === null ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <div className="collection-block">
                        {boosterData
                            .filter((item) => !item.redeemed)
                            .map((item) => (
                                <div className="booster" key={item.boosterId}>
                                    <button className="redeem-button" onClick={() => redeemBooster(item.boosterId)}>
                                        <div className="booster-content">
                                            <label htmlFor={`BP-${item.boosterId}`}>{item.boosterName}</label>
                                            <img className="booster-image" id={`BP-${item.boosterId}`} src={boosterImg}
                                                 alt="BP"/>
                                        </div>
                                        Redeem
                                    </button>
                                </div>
                            ))
                        }
                    </div>
                )
                }
            </div>
            {boosterData === null ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="collection">
                    <div className="collection-left">
                        <ul>
                            {boosterData
                                .filter((item) => item.redeemed)
                                .map((item) => (
                                    <li key={item.boosterId}>
                                        <a href={`#${item.boosterId}`}>{item.boosterName}</a>
                                    </li>
                                ))}
                        </ul>
                    </div>
                    <div className="collection-right">
                        {boosterData
                            .filter((item) => item.redeemed)
                            .map((item) => (
                                <div key={item.boosterId} id={`${item.boosterId}`}>
                                    <div className="collection-title">
                                        <span className="collection-count">5</span>
                                        <span className="collection-name">{item.boosterName} </span>
                                    </div>
                                    <div className="collection-block">
                                        {
                                            item.redeemed && item.cards
                                                .filter((card) => card.img)
                                                .map((card) =>
                                                    (
                                                        <Card key={card.cardNumber} imageUrl={card.img}
                                                              onClickSell={() => sellCard(item.boosterId, card.cardNumber)}
                                                              onClickBuy={() => {
                                                              }} isOwner={true}
                                                              owner={walletAddress.substring(0, 3) + "..." + walletAddress.substring(38)}
                                                              cardData={card.cardGid} onSell={card.onSell}
                                                              showButtons={true}/>
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

export default UserBoosters;
