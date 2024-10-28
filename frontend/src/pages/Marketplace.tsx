import React, {useEffect, useState} from 'react';
import axios from 'axios';
import '../css/Boosters.css'
import Card from "@/components/Card";
import {BigNumber, ethers} from "ethers";

interface BoosterProps {
    wallet: any
}

interface ListingItem {
    id: number;
    seller: string;
    collectionId: number;
    tokenId: number;
    price: number;
    img: string;
    cardNumber: number;
    cardGid: number;
    onSell: boolean;
    cardOwner: string;
}

const Marketplace: React.FC<BoosterProps> = ({wallet}) => {
    const [listingData, setListingData] = useState<ListingItem[] | null>(null);
    const [walletAddress, setWalletAddress] = useState<string>("");

    useEffect(() => {
        if (wallet?.details.account) {
            getListing()
            setWalletAddress(wallet.details.account)
        }
    }, [wallet]);

    const getListing = () => {
        axios
            .get(`http://localhost:3000/api/collections/getListing`)
            .then((response) => {
                setListingData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }

    const buyCard = async (listingId: number) => {
        const valueInWei: BigNumber = ethers.utils.parseEther("0.1");

        if (wallet?.contract) {
            const sell = await wallet.contract.buyCard(listingId, {value: valueInWei});
            sell.wait().then(getListing)
        }

    };


    return (
        <div className="page-content">
            <h1>Marketplace</h1>
            <div className="not-redeemed">
                {listingData === null ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <div className="collection-block">
                        {listingData
                            .map((item) => (
                                <Card key={item.id} imageUrl={item.img}
                                      onClickSell={() => {
                                      }}
                                      onClickBuy={() => buyCard(item.id)}
                                      cardData={item.cardGid} onSell={item.onSell}
                                      isOwner={walletAddress === item.cardOwner} showButtons={true}
                                      owner={item.cardOwner.substring(0, 3) + "..." + item.cardOwner.substring(38)}/>
                            ))
                        }
                    </div>
                )
                }
            </div>
        </div>
    );
};

export default Marketplace;
