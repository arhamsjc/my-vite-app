import { DataTable } from './components/DataTable'
import { TableProvider } from './context/TableContext'
import './App.css'

function App() {
  return (
    <div className="app">
      <h1>BrewDog Beer Catalog</h1>
      <TableProvider>
        <DataTable />
      </TableProvider>
    </div>
  )
}

export default App
