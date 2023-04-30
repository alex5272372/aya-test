import { NextPage } from 'next'

const Grid: NextPage<{ columns: {
  name: string, type: string, title: string
}[], data: any[] }> = ({ columns, data }) => {

  const mapValue = (row: any, col: {name: string, type: string, title: string}) => {
    if (col.type === 'date') return row[col.name].split('T')[0]
    if (col.type === 'money')
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row[col.name] / 100)
    if (col.type === 'percent') return `${row[col.name] / 100}%`
    return row[col.name]
  }

  return (
    <table className="m-2 border-collapse border border-slate-500">
      <thead>
        <tr>
          {columns.map((col, j) => <th key={j} className="p-1 border border-slate-700">{col.title}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.map((row: any, i: number) =>
        <tr key={i}>
          {columns.map((col, j) => <td key={j} className="p-1 border border-slate-700">{mapValue(row, col)}</td>)}
        </tr>)}
      </tbody>
    </table>
  )
}

export default Grid
