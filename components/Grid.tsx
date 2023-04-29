import { NextPage } from 'next'

const Grid: NextPage<{ columns: string[], data: any }> = ({ columns, data }) => {
  return (
    <table className="m-2 border-collapse border border-slate-500">
      <thead>
        <tr>
          {columns.map((col, j) => <th key={j} className="p-1 border border-slate-700">{col}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.map((row: any, i: number) =>
        <tr key={i}>
          {columns.map((col, j) => <td key={j} className="p-1 border border-slate-700">{row[col]}</td>)}
        </tr>)}
      </tbody>
    </table>
  )
}

export default Grid
