
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Invoice from './Components/Invoice';
import InvoiceSummary from './Components/InvoiceSummary';
function App() {


  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Invoice />} />
      <Route exact path="/invoice-summary" element={<InvoiceSummary />} />
    </Routes>
  </BrowserRouter>
    </>
  )
}

export default App
