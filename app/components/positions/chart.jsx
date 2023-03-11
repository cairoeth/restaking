import dynamic from "next/dynamic";

const ChartIndex = dynamic(() => import("./chartGen"), {
  ssr: false
});

export function Chart() {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <ChartIndex width={880} height={473} />
      </div>
    </div>
  )
}