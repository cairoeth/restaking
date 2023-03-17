export function Column({ first, second, third, slug }) {
  return (
    <td>
      <a href={'/module/' + slug}>
        <div>
          <div className="text-base text-left text-gray-500">{first}</div>
          <div className="text-lg font-bold text-left">{second}</div>
          <div className="text-base text-left text-gray-500">{third}</div>
        </div>
      </a>
    </td>
  )
}
