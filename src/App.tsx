import './App.css';
import { Box, Text } from '@chakra-ui/react';
import EquipmentPage from './EquipmentListPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
{/* <Box minHeightheight="100vh"></Box> */ }
function App() {
  return (
    <Box>
      <ToastContainer />
      <Box bg='#000000' width="100%" padding="4" color="white">
        <Text>Equipment List</Text>
      </Box>
      <Box paddingLeft="10%" paddingRight="10%" paddingTop="2.5%" paddingBottom="2.5%">
        <EquipmentPage />
      </Box>
    </Box>
  );
}

export default App;
