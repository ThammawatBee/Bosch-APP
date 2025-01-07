import { Button } from "../components/ui/button";
import { checkEquipmentExpiredDate } from "../service/bosch";
import { Box, Text } from "@chakra-ui/react"
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify"

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
            <Box borderColor="black" borderWidth="1px" width={'200px'} height={'200px'} background={'white'} borderRadius="20px">

            </Box>
          </Link>
          <Text textAlign='center' textStyle="lg" marginTop={'15px'}>Equipment List</Text>
        </Box>
        <Box marginRight={"50px"}>
          <Link to="/inspection">
            <Box borderColor="black" borderWidth="1px" width={'200px'} height={'200px'} background={'white'} borderRadius="20px">

            </Box>
          </Link>
          <Text textAlign='center' textStyle="lg" marginTop={'15px'}>Inspection List</Text>
        </Box>
        <Box>
          <Link to="/report">
            <Box borderColor="black" borderWidth="1px" width={'200px'} height={'200px'} background={'white'} borderRadius="20px">

            </Box>
          </Link>
          <Text textAlign='center' textStyle="lg" marginTop={'15px'}>Inspection Result Report</Text>
        </Box>
      </Box>
    </Box>
  </Box>
}

export default HomePage
