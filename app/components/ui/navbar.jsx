import { ConnectKitProvider, ConnectKitButton, getDefaultClient } from "connectkit";

export function Navbar() {
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <a className="btn btn-ghost normal-case text-xl text-left" href="/">Restaking</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><a href="/">Dashboard</a></li>
        </ul>
      </div>
      <div className="navbar-end">
        <ConnectKitButton />
      </div>
    </div>
  )
}