import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import './App.css';
import { Box, Text } from '@chakra-ui/react';
import EquipmentPage from './pages/EquipmentListPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InspectionPage from "./pages/InspectionPage";
import ReportPage from "./pages/ReportPage";
import HomePage from "./pages/HomePage";
import Logo from './assets/image/logo-company.png'

function App() {
  return (
    <Router>
      <Box>
        <ToastContainer />
        <Box bg='#000000' width="100%" padding="4" color="white" display='flex' alignItems='center'>
          <img src={Logo} style={{ width: '200px', marginRight: '40px' }} />
          <Box marginRight='20px'>
            <Link to="/equipment"><Text>Equipment List</Text></Link>
          </Box>
          <Box marginRight='20px'>
            <Link to="/inspection"><Text>Inspection List</Text></Link>
          </Box>
          <Box>
            <Link to="/report"><Text>Inspection Result Report</Text></Link>
          </Box>
        </Box>
        <Box paddingLeft="10%" paddingRight="10%" paddingTop="2.5%" paddingBottom="2.5%">
          <Routes>
            <Route path="/report" element={<ReportPage />} />
            <Route path="/inspection" element={<InspectionPage />} />
            <Route path="/equipment" element={<EquipmentPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Box>
      </Box >
    </Router>
  );
}

export default App;
