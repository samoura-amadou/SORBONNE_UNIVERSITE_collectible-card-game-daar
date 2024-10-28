import { useEffect, useMemo, useRef, useState } from "react";
import * as ethereum from "@/lib/ethereum";
import * as main from "@/lib/main";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Collections from "@/pages/Collections";
import UserCollections from "@/pages/UserCollections";
import UserBoosters from "@/pages/UserBoosters";
import Marketplace from "@/pages/Marketplace";
import { NavBar } from "@/components/NavBar";

type Canceler = () => void;
const useAffect = (
  asyncEffect: () => Promise<Canceler | void>,
  dependencies: any[] = []
) => {
  const cancelerRef = useRef<Canceler | void>();
  useEffect(() => {
    asyncEffect()
      .then((canceler) => (cancelerRef.current = canceler))
      .catch((error) => console.warn("Uncatched error", error));
    return () => {
      if (cancelerRef.current) {
        cancelerRef.current();
        cancelerRef.current = undefined;
      }
    };
  }, dependencies);
};

const useWallet = () => {
  const [details, setDetails] = useState<ethereum.Details>();
  const [contract, setContract] = useState<main.Main>();
  useAffect(async () => {
    const details_ = await ethereum.connect("metamask");
    if (!details_) return;
    setDetails(details_);
    const contract_ = await main.init(details_);
    if (!contract_) return;
    setContract(contract_);
  }, []);
  return useMemo(() => {
    if (!details || !contract) return;
    return { details, contract };
  }, [details, contract]);
};

export const App = () => {
  const wallet = useWallet();
  return (
    <Router>
      <NavBar wallet={wallet} />
      <Routes>
        <Route path="/" element={<Collections wallet={wallet} />} />
        <Route path="/marketplace" element={<Marketplace wallet={wallet} />} />
        <Route path="/me" element={<UserCollections wallet={wallet} />} />
        <Route path="/boosters" element={<UserBoosters wallet={wallet} />} />
      </Routes>
    </Router>
  );
};
