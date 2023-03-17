import { ConnectKitProvider, ConnectKitButton, getDefaultClient } from "connectkit";
import Link from 'next/link'

export function Navbar() {
  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <Link className="btn btn-ghost normal-case text-xl text-left" href="/">Restaking</Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link href="/">Dashboard</Link></li>
          <li><Link href="/modules">Modules</Link></li>
          <li tabIndex={0}>
            <a>
              More
              <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg>
            </a>
            <ul className="p-2 bg-base-100">
              <li><Link href="#">Docs</Link></li>
            </ul>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <ConnectKitButton />
      </div>
    </div>
  )
}
