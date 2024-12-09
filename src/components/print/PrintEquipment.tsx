import { Box, Text } from "@chakra-ui/react"
import { css } from "@emotion/react";
import { QRCodeSVG } from 'qrcode.react';
import "./PrintStyle.css";
import { Equipment } from "@/interface/CreateEquipmentForm";
import { DateTime } from "luxon";

const PrintEquipment = ({ componentPrintRef, equipment }:
  { componentPrintRef: HTMLElement, equipment?: Equipment | null }) => {
  return <Box padding={"15px"} width="265px" height="189px" display='flex' ref={componentPrintRef} background={'white'} alignItems={'center'} justifyContent={'space-between'}>
    <Box background={'white'} overflow={'hidden'}>
      <Box background={'white'} textOverflow={'ellipsis'} whiteSpace={'nowrap'} overflow={'hidden'} fontSize={"16px"}>
        {equipment?.equipmentNumber}
      </Box>
      <Box marginTop={"10px"} background={'white'} textOverflow={'ellipsis'} whiteSpace={'nowrap'} overflow={'hidden'} fontSize={"16px"}>
        {equipment?.name}
      </Box>
      {equipment?.type === 'EXTERNAL' ? <Box marginTop={"10px"} background={'white'} textOverflow={'ellipsis'} whiteSpace={'nowrap'} overflow={'hidden'} fontSize={"16px"}>
        {DateTime.fromISO(equipment.expiredDate).toFormat('dd-MM-yyyy')}
      </Box> : null}
    </Box >
    <Box background={'white'}>  <QRCodeSVG value={equipment?.equipmentNumber || ''} size={100} /></Box>
  </Box>
}

export default PrintEquipment