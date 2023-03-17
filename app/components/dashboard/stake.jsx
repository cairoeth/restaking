export function Stake({ title }) {
  return (
    <div className="ml-20 w-11/12">
      <div className="navbar">
        <div className="navbar-start">
          <p className="mt-2 flex items-baseline gap-x-2">
            <span className="text-3xl font-bold tracking-tight text-black">{title}</span>
          </p>
        </div>

        <div className="navbar-center hidden lg:flex"></div>

        <div className="navbar-end">test</div>
      </div>

      <div className="contents">
        <div className="rounded-3xl bg-white mx-auto w-full">
          <div className="ring-1 ring-gray-200 lg:mx-0 lg:flex lg:max-w-none">

          </div>
        </div>
      </div>
    </div>
  )
}
