import React, {useEffect, useState} from 'react';
import '../css/Card.css';
import CardPopup from "@/components/CardPopup";
import axios from "axios"; // Import your CSS file for styling

interface CardProps {
    imageUrl: string;
    cardData: number;
    onSell: boolean;
    onClickSell: any;
    onClickBuy: any;
    isOwner: boolean;
    showButtons: boolean;
    owner: string;
}

interface CardInfo {
    gid: string;
    cid: string;
    n: string;
    t: string;
    col: string;
    cs: string;
    tr: string;
    a: string;
    p: string;
    cp: any;
    l: any;
    r: string;
    ar: any;
    iu: string;
    e: string;
    al: any;
    intl: string;
    srcN: string;
    scrD: any;
}

const Card: React.FC<CardProps> = ({
                                       imageUrl,
                                       cardData,
                                       onSell,
                                       onClickSell,
                                       onClickBuy,
                                       isOwner,
                                       showButtons,
                                       owner
                                   }) => {

    const [isPopupOpen, setPopupOpen] = useState(false);
    const [cardJson, setCardJson] = useState<CardInfo | null>(null);

    const openPopup = () => {
        setPopupOpen(true);
    };

    const closePopup = () => {
        setPopupOpen(false);
    };

    useEffect(() => {
        // Fetch data from an API using Axios
        console.log("tttttttttttttttttttttttttttttttttttttttttttttttt")
        console.log(cardData)

        axios.get(`http://localhost:3000/api/cards/getInfo/${cardData}`)
            .then((response) => {
                setCardJson(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);


    let classname = owner === "you" ? " owner-text-card you-owner" : "owner-text-card";
    return (
        <div className="card-block">
            <div className="card">
                <img src={imageUrl} alt="Card" className="card-image" onClick={openPopup}/>
                {cardJson && isPopupOpen && (
                    <CardPopup
                        cardImg={imageUrl}
                        cardData={cardJson}
                        onClose={closePopup}
                    />
                )}
            </div>
            {
                showButtons ?
                    onSell ? (
                        isOwner ? (<div> on sale </div>) : (
                            <button className="buy-button" onClick={onClickBuy}> Buy </button>)
                    ) : (
                        isOwner ? (<button className="sell-button" onClick={onClickSell}> Sell </button>) : (
                            <div></div>)
                    )
                    : (<div className={classname}>owned by: <span>{owner}</span></div>)
            }

        </div>

    );
};

export default Card;
