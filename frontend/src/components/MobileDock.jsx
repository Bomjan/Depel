import { NavLink } from 'react-router-dom'
import { HomeIcon, GridIcon, UsersIcon, MailIcon } from './Icons'

function DockItem({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `dock-item ${isActive ? 'active' : ''}`}
      aria-label={label}
    >
      <span className="dock-icon" aria-hidden="true">{icon}</span>
      <span className="dock-label">{label}</span>
    </NavLink>
  )
}

export default function MobileDock() {
  return (
    <nav className="dock" aria-label="Mobile bottom navigation">
      <DockItem to="/" label="Home" icon={<HomeIcon size={20} />} />
      <DockItem to="/catalog" label="Catalog" icon={<GridIcon size={20} />} />
      <DockItem to="/people" label="People" icon={<UsersIcon size={20} />} />
      <DockItem to="/contact" label="Contact" icon={<MailIcon size={20} />} />
    </nav>
  )
}

