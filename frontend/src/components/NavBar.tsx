import React from 'react'
import { NavLink } from 'react-router-dom'
import TextConnection from './TextConnection'
import * as ethereum from '@/lib/ethereum'
import * as main from '@/lib/main'

export interface INavBarProps {
  wallet?: {
    details: ethereum.Details
    contract: main.Main
  }
}

export function NavBar({ wallet }: INavBarProps) {
  return (
    // Exemple d'utilisation du composant Nav fixe avec React Router
    <nav className="links">
      <div>
        <NavLink
          to="/"
          className={navData => (navData.isActive ? 'active' : '')}
        >
          All Collections
        </NavLink>
      </div>
      <div>
        <NavLink
          to="/marketplace"
          className={navData => (navData.isActive ? 'active' : '')}
        >
          Marketplace
        </NavLink>
      </div>
      <div>
        <NavLink
          to="/me"
          className={navData => (navData.isActive ? 'active' : '')}
        >
          My Collections
        </NavLink>
      </div>
      <div>
        <NavLink
          to="/boosters"
          className={navData => (navData.isActive ? 'active' : '')}
        >
          My Boosters
        </NavLink>
      </div>
      <TextConnection wallet={wallet} />
    </nav>
  )
}
