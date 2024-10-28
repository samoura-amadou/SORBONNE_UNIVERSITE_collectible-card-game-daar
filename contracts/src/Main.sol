// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

<<<<<<< HEAD
import "./Collection.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Main is Ownable {
    int256 private countC;
    mapping(int => Collection) public collections;
    Listing[] public listings;
    uint256 public listingPrice = 0.1 ether;

    struct Listing {
        address seller; int256 collectionId; uint256 tokenId; uint256 price;
    }

    struct Listings {
        uint256 id; Listing info; CardInfo card;
    }

    struct CollectionInfo {
        int collectionId; string collectionName; uint256 cardCount; CardInfo[] cards; bool redeemed; address owner;
    }

    struct Card {
        string img; int256 gid;
    }

    struct CardInfo {
        string img; uint256 cardNumber; int gid; bool onSell; address owner;
    }
    constructor(){
        countC = 0;
    }
    function createCollection(string memory name, uint256 cardCount) external onlyOwner {
        collections[countC] = new Collection(name, cardCount, address(this));
        countC++;
    }

    function createBooster() external {
        collections[countC] = new Collection("BP", 5, msg.sender);
        collections[countC].setRedeemed(false);
        countC++;
    }

    function redeemBooster(int256 boosterId, Card[] memory c) external {
        require(collections[boosterId] != Collection(address(0)), "[BNEx]");
        require(collections[boosterId].owner() == msg.sender, "OW2");
        for (uint256 i = 0; i < 5; i++) {
            collections[boosterId].mintTo(msg.sender, c[i].img, c[i].gid);
        }
        collections[boosterId].setRedeemed(true);
    }

    function mintCardToCollection(int256 collectionId, address to, string memory img, int256 gid) external onlyOwner {
        require(collections[collectionId] != Collection(address(0)), "[NEx]");
        collections[collectionId].mintTo(to, img, gid);
    }

    function getCollectionsAndCards(bool all, bool boosters, address user) public view returns (CollectionInfo[] memory) {
        CollectionInfo[] memory collectionInfo = new CollectionInfo[](uint256(countC));
        for (int256 i = 0; i < countC; i++) {
            CardInfo[] memory cardInfo = new CardInfo[](collections[i].cardCount());
            if (collections[i].redeemed()) {
                for (uint256 j = 0; j < collections[i].cardCount(); j++) {
                    (string memory img, uint256 cardNumber, int256 gid, bool onSell, address cardOwner) = collections[i].getCardInfo(j);
                    if (all) {
                        cardInfo[j] = CardInfo(img, cardNumber, gid, onSell, cardOwner);
                    } else {
                        if (cardOwner == user) {
                            cardInfo[j] = CardInfo(img, cardNumber, gid, onSell, cardOwner);
                        }
                    }
                }
            }

            if (all || !boosters) {
                collectionInfo[uint256(i)] = CollectionInfo(i, collections[i].collectionName(), collections[i].cardCount(), cardInfo, collections[i].redeemed(), collections[i].owner());
            } else {
                if (collections[i].owner() == user) {
                    collectionInfo[uint256(i)] = CollectionInfo(i, collections[i].collectionName(), collections[i].cardCount(), cardInfo, collections[i].redeemed(), collections[i].owner());
                }
            }

        }
        return collectionInfo;
    }

    function listCard(int256 collectionId, uint256 tokenId) external {
        require(collections[collectionId] != Collection(address(0)), "[NEx]");
        require(collections[collectionId].ownerOf(tokenId) == msg.sender, "Not the token owner");
        listings.push(Listing(msg.sender, collectionId, tokenId, listingPrice));
        collections[collectionId].listCard(tokenId, msg.sender);
    }

    function buyCard(uint256 listingIndex) external payable {
        require(listingIndex < listings.length, "LInd");

        collections[listings[listingIndex].collectionId].transferCard(listings[listingIndex].tokenId, listings[listingIndex].price, listings[listingIndex].seller, msg.sender, msg.value);

        // remove the listing
        if (listingIndex < listings.length - 1) {
            listings[listingIndex] = listings[listings.length - 1];
        }
        listings.pop();
    }

    function getListing() public view returns (Listings[] memory) {
        Listings[] memory list = new Listings[](uint256(listings.length));
        for (uint256 i = 0; i < listings.length; i++) {
            (string memory img, uint256 cardNumber, int256 gid, bool onSell, address cardOwner) = collections[listings[i].collectionId].getCardInfo(listings[i].tokenId);
            list[uint256(i)] = Listings(i, listings[i], CardInfo(img, cardNumber, gid, onSell, cardOwner));
        }
        return list;
    }
=======
import './Ship.sol';
import 'hardhat/console.sol';

struct Game {
  uint height;
  uint width;
  mapping(uint => mapping(uint => uint)) board;
  mapping(uint => int) xs;
  mapping(uint => int) ys;
}

contract Main {
  Game private game;
  uint private index;
  mapping(address => bool) private used;
  mapping(uint => address) private ships;
  mapping(uint => address) private owners;
  mapping(address => uint) private count;

  event Size(uint width, uint height);
  event Touched(uint ship, uint x, uint y);
  event Registered(
    uint indexed index,
    address indexed owner,
    uint x,
    uint y
  );

  constructor() {
    game.width = 50;
    game.height = 50;
    index = 1;
    emit Size(game.width, game.height);
  }

  function register(address ship) external {
    require(count[msg.sender] < 2, 'Only two ships');
    require(used[ship], 'Ship alread on the board');
    require(index <= game.height * game.width, 'Too much ship on board');
    count[msg.sender] += 1;
    ships[index] = ship;
    owners[index] = msg.sender;
    (uint x, uint y) = placeShip(index);
    Ship(ships[index]).update(x, y);
    emit Registered(index, msg.sender, x, y);
    index += 1;
  }

  function turn() external {
    bool[] memory touched = new bool[](index);
    for (uint i = 1; i < index; i++) {
      if (game.xs[i] < 0) continue;
      Ship ship = Ship(ships[i]);
      (uint x, uint y) = ship.fire();
      if (game.board[x][y] > 0) {
        touched[game.board[x][y]] = true;
      }
    }
    for (uint i = 0; i < index; i++) {
      if (touched[i]) {
        emit Touched(i, uint(game.xs[i]), uint(game.ys[i]));
        game.xs[i] = -1;
      }
    }
  }

  function placeShip(uint idx) internal returns (uint, uint) {
    Ship ship = Ship(ships[idx]);
    (uint x, uint y) = ship.place(game.width, game.height);
    bool invalid = true;
    while (invalid) {
      if (game.board[x][y] == 0) {
        game.board[x][y] = idx;
        game.xs[idx] = int(x);
        game.ys[idx] = int(y);
        invalid = false;
      } else {
        uint newPlace = (x * game.width) + y + 1;
        x = newPlace % game.width;
        y = newPlace / game.width;
      }
    }
    return (x, y);
  }
>>>>>>> 72a3962 (First commit)
}
