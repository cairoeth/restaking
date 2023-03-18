import Link from 'next/link'

type Props = {
  first: string;
  second: string;
  third: string;
  slug: string;
};

export function Column({first, second, third, slug}: Props): JSX.Element {
  return (
    <td>
      <Link href={'/module/' + slug}>
        <div>
          <div className="text-base text-left text-gray-500">{first}</div>
          <div className="text-lg font-bold text-left">{second}</div>
          <div className="text-base text-left text-gray-500">{third}</div>
        </div>
      </Link>
    </td>
  )
}
