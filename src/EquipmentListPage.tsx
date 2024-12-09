import { Box, Button, IconButton, Table, Text } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"
import { DateTime } from "luxon"
import "./EquipmentListPage.css";
import EquipmentFormDialog from "./components/EquipmentFormDialog"
import { Equipment } from "./interface/CreateEquipmentForm";
import { FiEdit } from "react-icons/fi";
import { LuPrinter } from "react-icons/lu";
import axios from "axios";
import PrintEquipment from "./components/print/PrintEquipment";
import { useReactToPrint } from "react-to-print";
import useEquipmentStore from "./store/equipmentStore";



const EquipmentPage = () => {

  const [open, setOpen] = useState(false)
  // const [equipments, setEquipment] = useState<Equipment[] | null>(null)
  const [editEquipment, setEditEquipment] = useState<Equipment | null>(null)
  const [progress, setProgress] = useState(0);
  const [printEquipment, setPrintEquipment] = useState<Equipment | null>(null)
  const { equipments, fetchEquipments } = useEquipmentStore()

  // const fetchData = async () => {
  //   const data = await listEquipments()
  //   setEquipment(data?.equipments)
  // }
  useEffect(() => {
    if (!equipments) {
      fetchEquipments()
    }
  }, [])

  useEffect(() => {
    if (printEquipment) {
      printFn()
    }
  }, [printEquipment])

  const componentPrintRef = useRef(null);
  const printFn = useReactToPrint({
    contentRef: componentPrintRef,
  });

  const handleExportEquipment = async () => {
    const apiUrl = 'http://localhost:3001/equipments/export'; // Replace with your API endpoint

    try {
      const response = await axios.get(apiUrl, {
        responseType: 'blob', // Handle response as Blob
        headers: {
          Accept: 'text/csv; charset=utf-8',
        },
      });

      // Create a Blob URL for the downloaded CSV
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);

      // Trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'equipment.csv'); // File name
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading CSV:', error);
      setProgress(0);
    }
  }

  const handleDownloadLargeCsv = async () => {
    const apiUrl = 'http://localhost:3001/large-csv'; // Replace with your API endpoint

    try {
      const response = await axios.get(apiUrl, {
        responseType: 'blob', // Handle response as Blob
        headers: {
          Accept: 'text/csv; charset=utf-8',
        },
      });

      // Create a Blob URL for the downloaded CSV
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);

      // Trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'data.csv'); // File name
      document.body.appendChild(link);
      link.click();
      link.remove();

      setProgress(100); // Ensure progress reaches 100%
    } catch (error) {
      console.error('Error downloading CSV:', error);
      setProgress(0);
    }
  };
  return <Box>
    <Box>
      <Text color="#3D4D99" fontWeight="bold" textStyle="lg" mb="15px">Equipment List</Text>
      {equipments?.length ? <Box mb="15px">
        <Table.Root size="md">
          <Table.Header>
            <Table.Row background={"#F6F6F6"}>
              <Table.ColumnHeader></Table.ColumnHeader>
              <Table.ColumnHeader>Type</Table.ColumnHeader>
              <Table.ColumnHeader>Equipment No.</Table.ColumnHeader>
              <Table.ColumnHeader>Name</Table.ColumnHeader>
              <Table.ColumnHeader>Brand</Table.ColumnHeader>
              <Table.ColumnHeader>Inspection Period</Table.ColumnHeader>
              <Table.ColumnHeader>Next Inspection</Table.ColumnHeader>
              <Table.ColumnHeader>Expired Date</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
              <Table.ColumnHeader></Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {equipments.map((equipment) => (
              <Table.Row key={equipment.id}>
                <Table.Cell>
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    onClick={() => {
                      setEditEquipment(equipment)
                      setOpen(true)
                    }}
                  >
                    <FiEdit />
                  </IconButton></Table.Cell>
                <Table.Cell>{equipment.type}</Table.Cell>
                <Table.Cell>{equipment.equipmentNumber}</Table.Cell>
                <Table.Cell>{equipment.name}</Table.Cell>
                <Table.Cell>{equipment.brand}</Table.Cell>
                <Table.Cell>{equipment.inspectionPeriod} Month</Table.Cell>
                <Table.Cell>{DateTime.fromISO(equipment.nextInspection).toFormat('dd-MM-yyyy')}</Table.Cell>
                <Table.Cell>{DateTime.fromISO(equipment.expiredDate).toFormat('dd-MM-yyyy')}</Table.Cell>
                <Table.Cell>{equipment.status}</Table.Cell>
                <Table.Cell>
                  <IconButton
                    variant="outline"
                    size={"sm"}
                    onClick={() => {
                      setPrintEquipment(equipment)
                    }}
                  >
                    <LuPrinter />
                  </IconButton></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box> : <div />}
      <Button variant="solid" size="lg" fontWeight="bold" background="#44549D" onClick={() => setOpen(true)}>
        Add New
      </Button>
      <Box marginTop={'20px'}>
        <Button variant="solid" size="lg" fontWeight="bold" onClick={() => handleExportEquipment()} marginRight={'10px'}>Export</Button>
        <Button variant="solid" size="lg" fontWeight="bold" onClick={() => handleDownloadLargeCsv()}>
          Download Large Csv
        </Button>
      </Box>
      {/* <Box>
        <Button variant="solid" size="lg" fontWeight="bold" onClick={() => {
          printFn()
        }}>
          Print
        </Button>
      </Box>
      <Box>
        <PrintEquipment componentPrintRef={componentPrintRef} equipment={printEquipment} />
      </Box> */}
      <EquipmentFormDialog isOpenDialog={open} setOpenDialog={(value) => {
        setOpen(value)
        if (!value) {
          setEditEquipment(null)
        }
      }} selectedEquipment={editEquipment} />
    </Box >
  </Box >
}
export default EquipmentPage