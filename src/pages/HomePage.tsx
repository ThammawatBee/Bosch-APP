import { Button } from "../components/ui/button";
import { checkEquipmentExpiredDate } from "../service/bosch";
import { Box, Text } from "@chakra-ui/react"
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify"
import Equipment from '../assets/image/Equipment.png'
import Inspection from '../assets/image/Inspection.jpg'
import Report from '../assets/image/Report.jpg'


const HomePage = () => {
  const [isLoading, setLoading] = useState(false)
  return <Box>
    <Box display='flex' justifyContent='flex-end'>
      <Button variant="solid" size="lg" fontWeight="bold"
        loading={isLoading}
        onClick={async () => {
          setLoading(true)
          await checkEquipmentExpiredDate()
          setLoading(false)
          toast.success('Update data success', {
            style: { color: '#18181B' },
            position: "top-right",
            autoClose: 3500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }}
      >
        Update Data
      </Button>
    </Box>
    <Box height={'60.5vh'} display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
      <Text textStyle="3xl" fontWeight="bold">Select Menu</Text>
      <Box display='flex' alignItems='center' justifyContent='center' marginTop={'50px'}>
        <Box marginRight={"50px"}>
          <Link to="/equipment">
            <Box display="flex" alignItems='center' justifyContent='center' borderColor="black" borderWidth="1px" width={'200px'} height={'200px'} background={'white'} borderRadius="20px"
              // _hover={{ background: '#F4F4F5' }}
            >
              <img src={Equipment} style={{ width: '160xp', height: '160px' }} />
            </Box>
          </Link>
          <Text textAlign='center' textStyle="lg" marginTop={'15px'}>Equipment List</Text>
        </Box>
        <Box marginRight={"50px"}>
          <Link to="/inspection">
            <Box display="flex" alignItems='center' justifyContent='center' borderColor="black" borderWidth="1px" width={'200px'} height={'200px'} background={'white'} borderRadius="20px"
            // _hover={{ background: '#F4F4F5' }}
            >
              <img src={Inspection} style={{ width: '160xp', height: '160px' }} />
            </Box>
          </Link>
          <Text textAlign='center' textStyle="lg" marginTop={'15px'}>Inspection List</Text>
        </Box>
        <Box>
          <Link to="/report">
            <Box display="flex" alignItems='center' justifyContent='center' borderColor="black" borderWidth="1px" width={'200px'} height={'200px'} background={'white'} borderRadius="20px"
            // _hover={{ background: '#F4F4F5' }}
            >
              <img src={Report} style={{ width: '160xp', height: '160px' }} />
            </Box>
          </Link>
          <Text textAlign='center' textStyle="lg" marginTop={'15px'}>Inspection Result Report</Text>
        </Box>
      </Box>
    </Box>
  </Box>
}

export default HomePage
