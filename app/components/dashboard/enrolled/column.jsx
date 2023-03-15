export function Column({ first, second, third }) {
    return (
        <td>
            <div>
                <div className="text-base text-left text-gray-500">{first}</div>
                <div className="text-lg font-bold text-left">{second}</div>
                <div className="text-base text-left text-gray-500">{third}</div>
            </div>
        </td>
    )
}