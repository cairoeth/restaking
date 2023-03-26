import Link from 'next/link'

type PropsRestaked = {
  first: string;
  second: string;
  third: string;
  slug: string;
};

type PropsWrappers = {
  first: string;
  second: string;
  third: string;
  link: string;
};

export function ColumnRestaked({first, second, third, slug}: PropsRestaked): JSX.Element {
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

export function ColumnWrappers({first, second, third, link}: PropsWrappers): JSX.Element {
  return (
    <td>
      <Link href={link}>
        <div>
          <div className="text-base text-left text-gray-500">{first}</div>
          <div className="text-lg font-bold text-left">{second}</div>
          <div className="text-base text-left text-gray-500">{third}</div>
        </div>
      </Link>
    </td>
  )
}
