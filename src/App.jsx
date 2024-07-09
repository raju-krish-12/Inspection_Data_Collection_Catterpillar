
import { ChakraProvider } from '@chakra-ui/react'
import NavBar from './components/NavBar'
import DashBoard from './pages/DashBoard'
import LoginPage from './pages/LoginPage'
import {Routes, Route, BrowserRouter } from 'react-router-dom'
import InspectionDetails from './forms/InspectionDetails'
import FormLists from './forms/FormLists'
import TiresForm from './forms/TiresForm'
import ExteriorForm from './forms/ExteriorForm'
import BatteryForm from './forms/BatteryForm'
import BrakesForm from './forms/BrakesForm'
import EngineForm from './forms/EngineForm'
import FeedbackForm from './forms/FeedbackForm'
import { DataProvider } from './DataContext'

function App() {

  return (
    <div>
      <DataProvider>
      <ChakraProvider>
      <BrowserRouter>
      <NavBar/>

      <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/profile" element={<DashBoard/>}/>
        <Route path="/inspect" element={<InspectionDetails/>}/>
        <Route path="/inspect/:id" element={<FormLists/>}/>
        <Route path="/inspect/:id/tires" element={<TiresForm/>}/>
        <Route path="/inspect/:id/battery" element={<BatteryForm/>}/>
        <Route path="/inspect/:id/exterior" element={<ExteriorForm/>}/>
        <Route path="/inspect/:id/brakes" element={<BrakesForm/>}/>
        <Route path="/inspect/:id/engine" element={<EngineForm/>}/>
        <Route path="/inspect/:id/feedback" element={<FeedbackForm/>}/>
      </Routes>
      </BrowserRouter>
      </ChakraProvider>
      </DataProvider>
    </div>
  )
}

export default App
