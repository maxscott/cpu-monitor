import { Alert } from '../models';

function AlertListItem({ data, i }: { data: Alert, i: number }) {
  return (<tr>
    <td className="border px-6 py-2">{i}</td>
    <td className="border px-6 py-2">{data.start.x.toString()}</td>
    <td className="border px-6 py-2">{data.end?.x?.toString()}</td>
  </tr>)
}

export default function AlertTable({ data }: { data: Array<Alert> }) {
  return (
    <>
      <h1 className="text-center text-xl">Resolved Alerts</h1>
      <table className="shadow-lg bg-white table-fixed">
        <thead>
          <tr>
            <th className="w-1/4 bg-blue-100 border text-left px-6 py-2">#</th>
            <th className="w-1/4 bg-blue-100 border text-left px-6 py-2">Start</th>
            <th className="w-1/4 bg-blue-100 border text-left px-6 py-2">End</th>
          </tr>
        </thead>

        <tbody>
          {data.map((a,i) => <AlertListItem data={a} i={i+1} />)}
        </tbody>
      </table>
    </>
  )
}

