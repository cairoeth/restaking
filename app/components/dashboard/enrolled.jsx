import { ArrowsPointingInIcon } from "@heroicons/react/24/outline"

export function EnrolledStake() {
    return (
        <div className="card bg-base-100 shadow-xl mb-10">
            <div className="card-body">
                <h2 className="card-title">
                    <ArrowsPointingInIcon className="w-6 h-6" />
                    Enrolled stake
                </h2>
                <div className="overflow-x-auto max-h-min pb-8">
                    {/* table */}
                </div>
            </div>
        </div>
    )
}