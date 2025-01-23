import { Box} from "@chakra-ui/react"
import { QRCodeSVG } from 'qrcode.react';
import "./PrintStyle.css";
import { Equipment } from "@/interface/CreateEquipmentForm";
import { DateTime } from "luxon";

const PrintEquipment = ({ componentPrintRef, equipment }:
  { componentPrintRef: HTMLElement, equipment?: Equipment | null }) => {
  return <Box paddingY={"12px"}  paddingX={"14.5px"} width="189px" height="113px" display='flex' ref={componentPrintRef} background={'white'} alignItems={'center'} justifyContent={'space-between'}>
    <Box background={'white'} overflow={'hidden'}>
      <Box background={'white'} textOverflow={'ellipsis'} whiteSpace={'nowrap'} overflow={'hidden'} fontSize={"10px"} fontWeight={"bold"}>
        {equipment?.equipmentNumber}
      </Box>
      {/* // add text fontWeight bold */}
      <Box marginTop={"10px"} background={'white'} textOverflow={'ellipsis'} whiteSpace={'nowrap'} overflow={'hidden'} fontSize={"10px"} fontWeight={"bold"}>
        {equipment?.name}
      </Box>
      {equipment?.type === 'EXTERNAL' ? <Box marginTop={"10px"} background={'white'} textOverflow={'ellipsis'} whiteSpace={'nowrap'} overflow={'hidden'} fontSize={"10px"} fontWeight={"bold"}>
        {DateTime.fromISO(equipment.expiredDate).toFormat('dd-MM-yyyy')}
      </Box> : null}
    </Box >
    <Box background={'white'}>  <QRCodeSVG value={equipment?.equipmentNumber || ''} size={75} /></Box>
  </Box>
}

export default PrintEquipment