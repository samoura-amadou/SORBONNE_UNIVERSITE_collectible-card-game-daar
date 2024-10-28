import React from "react";

interface CardPopupProps {
  cardImg: string;
  cardData: CardInfo;
  onClose: () => void;
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

const trAssociations: { [key: string]: string } = {
  "1": "leader",
  "2": "character",
  "3": "event",
  "4": "stage",
  "5": "don",
};

const colorAssociations: { [key: string]: string } = {
  "1": "Red",
  "4": "Purple",
  "5": "DON",
  "6": "Blue",
  "7": "Green",
  "8": "Blue/Green",
  "9": "Red/Blue",
  "10": "Red/Green",
  "11": "Blue/Purple",
  "12": "Black",
  "13": "Purple/Black",
  "14": "Red/Black",
  "15": "Green/Blue",
  "16": "Yellow",
  "17": "Green/Yellow",
  "18": "Black/Yellow",
  "19": "Black/Blue",
  "20": "Black/Green",
  "21": "Purple/Yellow",
  "22": "Red/Yellow",
  "23": "Blue/Yellow",
  "24": "Red/Purple",
  "25": "Purple/Green",
};

const rarityAssociations: { [key: string]: string } = {
  "0": "TBD",
  "1": "Leader",
  "2": "Common",
  "3": "Uncommon",
  "4": "Rare",
  "5": "Super Rare",
  "6": "Secret Rare",
  "7": "Promo",
  "8": "Special Rare",
};

const atkAssociations: { [key: string]: string } = {
  "0": "NA",
  "1": "Slash",
  "2": "Strike",
  "3": "Ranged",
  "4": "Wisdom",
  "5": "Special",
  "6": "Slash/Strike",
};

const CardPopup: React.FC<CardPopupProps> = ({
  cardImg,
  cardData,
  onClose,
}) => {
  return (
    <div className="card-popup">
      <div className="popup-content">
        <span className="close-button" onClick={onClose}>
          X
        </span>
        <div>
          {cardData === null ? (
            <div>Loading...</div>
          ) : (
            <div className="card-title">
              <div className="info-col">
                <span>{cardData.cid}</span>|
                <span>{trAssociations[cardData.t]}</span>
              </div>
              <div className="cardName">{cardData.n}</div>
            </div>
          )}

          <div className="card-info">
            <div className="card-info-img">
              <img src={cardImg} alt="Card" />
            </div>
            <div>
              {cardData === null ? (
                <div>Loading...</div>
              ) : (
                <div className="backCol">
                  <div className="col2">
                    <div className="cost">
                      <h3>{cardData.l === null ? "Cost" : "Life"}</h3>
                      {cardData.l === null ? cardData.cs : cardData.l}
                    </div>
                    <div className="attribute">
                      <h3>Attribute</h3>
                      {atkAssociations[cardData.a] == "NA"
                        ? "-"
                        : atkAssociations[cardData.a]}
                    </div>
                  </div>
                  <div className="col2">
                    <div className="power">
                      <h3>Power</h3>
                      {cardData.p === null ? "-" : cardData.p}
                    </div>
                    <div className="counter">
                      <h3>Counter</h3>
                      {cardData.cp === null ? "-" : cardData.cp}
                    </div>
                  </div>
                  <div className="color">
                    <h3>Color</h3>
                    {colorAssociations[cardData.col]}
                  </div>
                  <div className="rarity">
                    <h3>Rarity</h3>
                    {rarityAssociations[cardData.r]}
                  </div>
                  <div className="feature">
                    <h3>Type</h3>
                    {cardData.tr}
                  </div>
                  <div className="text">
                    <h3>Effect</h3>
                    {cardData.e}
                  </div>
                  <div className="info">
                    <h3>Card Set</h3>
                    {cardData.srcN}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPopup;
