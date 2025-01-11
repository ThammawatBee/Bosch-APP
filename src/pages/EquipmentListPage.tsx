import { Box, HStack, IconButton, Input, NativeSelectField, NativeSelectRoot, Table, Text } from "@chakra-ui/react"
import { Button } from "../components/ui/button";
import { useEffect, useRef, useState } from "react"
import { DateTime } from "luxon"
import "../DatePicker.css";
import EquipmentFormDialog from "../components/EquipmentFormDialog"
import { Equipment } from "../interface/CreateEquipmentForm";
import { FiEdit } from "react-icons/fi";
import { LuPrinter } from "react-icons/lu";
import axios from "axios";
import PrintEquipment from "../components/print/PrintEquipment";
import { useReactToPrint } from "react-to-print";
import useEquipmentStore, { generateEquipmentParam } from "../store/equipmentStore";
import DatePicker from "react-datepicker"
import { Field } from "../components/ui/field"
import "react-datepicker/dist/react-datepicker.css";
import { PaginationItems, PaginationNextTrigger, PaginationPrevTrigger, PaginationRoot } from "../components/ui/pagination";
import PageSizeSelect from "../components/PageSizeSelect";


const EquipmentPage = () => {

  const [open, setOpen] = useState(false)
  // const [equipments, setEquipment] = useState<Equipment[] | null>(null)
  const [editEquipment, setEditEquipment] = useState<Equipment | null>(null)
  const [exportLoading, setExportLoading] = useState(false)
  const [printEquipment, setPrintEquipment] = useState<Equipment | null>(null)
  const { equipments, fetchEquipments, setSearch, search, offset, limit, count, onPageChange, onPageSizeChange } = useEquipmentStore()

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
    onAfterPrint: () => {
      setPrintEquipment(null)
    }
  });

  const handleExportEquipment = async () => {
    const apiUrl = `${process.env.REACT_APP_SERVICE_URL}/equipments/export`; // Replace with your API endpoint
    setExportLoading(true)
    try {
      const response = await axios.get(apiUrl, {
        responseType: 'blob', // Handle response as Blob
        headers: {
          Accept: 'text/csv; charset=utf-8',
        },
        params: generateEquipmentParam(search)
      });

      // Create a Blob URL for the downloaded CSV
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);

      // Trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `equipment ${DateTime.now().toFormat('dd-MM-yyyy HH:mm')}.csv`); // File name
      document.body.appendChild(link);
      link.click();
      link.remove();
      setExportLoading(false)
    } catch (error) {
      console.error('Error downloading CSV:', error);
      setExportLoading(false)
    }
  }

  return <Box backgroundColor={'white'} padding="20px" borderRadius={'8px'}>
    <Box>
      <Text color="#3D4D99" fontWeight="bold" textStyle="lg" mb="15px">Equipment List</Text>
      <Box mt="10px" display="flex" mb="10px" justifyContent='space-between'>
        <Field label="Type" width="18%">
          <NativeSelectRoot background={'white'} borderRadius={'8px'}>
            <NativeSelectField
              placeholder="All type"
              value={search?.type}
              onChange={(e) => {
                console.log('e.currentTarget.value', e.currentTarget.value)
                setSearch({ type: e.currentTarget.value })
              }}
              name="type"
            >
              <option value="BOSCH">Bosch</option>
              <option value="EXTERNAL">External</option>
            </NativeSelectField>
          </NativeSelectRoot>
        </Field>
        <Field label="Equipment No." width="18%">
          <Input
            background={'white'}
            value={search.equipmentNumber}
            onChange={(e) => {
              setSearch({ equipmentNumber: e.currentTarget.value })
            }} />
        </Field>
        <Field label="Name" width="18%">
          <Input background={'white'}
            value={search.name}
            onChange={(e) => {
              setSearch({ name: e.currentTarget.value })
            }} />
        </Field>
        <Field label="Brand" width="18%">
          <Input background={'white'}
            value={search.brand}
            onChange={(e) => {
              setSearch({ brand: e.currentTarget.value })
            }} />
        </Field>
        <Field label="Status" width="18%">
          <NativeSelectRoot background={'white'} borderRadius={'8px'}>
            <NativeSelectField
              placeholder="All Status"
              value={search?.status}
              onChange={(e) => setSearch({ status: e.currentTarget.value })}
            >
              <option value={"ENABLE"}>Enable</option>
              <option value={"DISABLE"}>Disable</option>
            </NativeSelectField>
          </NativeSelectRoot>
        </Field>
      </Box>
      <Box mt="10px" display="flex" mb="15px" justifyContent='space-between'>
        <Field label="Inspection Day" width="18%">
          <DatePicker
            dateFormat="dd-MM-yyyy"
            showMonthDropdown
            showYearDropdown
            isClearable
            onChange={(dates) => {
              const [start, end] = dates
              setSearch({ inspectionDayStart: start, inspectionDayEnd: end })
            }}
            selectsRange={true}
            startDate={search.inspectionDayStart}
            endDate={search.inspectionDayEnd}
            onKeyDown={(e) => e.preventDefault()}
            customInput={<Input
              readOnly={true}
              value={search.inspectionDayStart ? DateTime.fromJSDate(search.inspectionDayStart).toFormat('dd-MM-yyyy') : ''}
              background={'white'} />}
          />
        </Field>
        <Field label="Expired Day" width="18%">
          <DatePicker
            dateFormat="dd-MM-yyyy"
            showMonthDropdown
            showYearDropdown
            onChange={(dates) => {
              const [start, end] = dates
              setSearch({ expiredDayStart: start, expiredDayEnd: end })
            }}
            selectsRange={true}
            startDate={search.expiredDayStart}
            endDate={search.expiredDayEnd}
            onKeyDown={(e) => e.preventDefault()}
            customInput={<Input
              readOnly={true}
              value={search.expiredDayStart ? DateTime.fromJSDate(search.expiredDayStart).toFormat('dd-MM-yyyy') : ''}
              background={'white'} />}
          />
        </Field>
        <Box width="59%" />
      </Box>
      <Button variant="solid" size="lg" fontWeight="bold" mb="20px"
        onClick={async () => {
          await fetchEquipments({ offset: 0, reset: true })
        }}
      >
        Search
      </Button>
      <Box mb="15px">
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
            {equipments?.length ? equipments.slice(offset * limit, (offset + 1) * limit).map((equipment) => (
              <Table.Row key={equipment.id}
                // _hover={{ backgroundColor: 'red' }}
              >
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
            )) : null}
          </Table.Body>
        </Table.Root>
        {equipments?.length ? <Box mt={'15px'} mb={'15px'} display='flex' justifyContent={'space-between'}>
          <Box display={'flex'} fontSize={'14px'} alignItems={'center'}>
            Row per page
            <Box ml={"15px"} width={'50px'}>
              <PageSizeSelect limit={limit} onChangePageSize={async (pageSize: number) => {
                await onPageSizeChange(pageSize)
              }} />
            </Box>
            <Box ml={"15px"}>
              {(offset * limit) + 1} - {count < (limit * (offset + 1)) ? count : (limit * (offset + 1))} of {count}
            </Box>
          </Box>
          <PaginationRoot
            count={count}
            pageSize={limit}
            page={offset + 1}
            variant="solid"
            onPageChange={async (details: { page: number, pageSize: number }) => {
              await onPageChange(details.page)
            }}>
            <HStack>
              <PaginationPrevTrigger />
              <PaginationItems />
              <PaginationNextTrigger />
            </HStack>
          </PaginationRoot>
        </Box> : <Box height={'75px'} />}
      </Box>
      <Box display='flex'>
        <Button variant="solid" size="lg" fontWeight="bold" onClick={() => handleExportEquipment()} marginRight={'15px'} loading={exportLoading}>Export</Button>
        <Button variant="solid" size="lg" fontWeight="bold" background="#44549D" onClick={() => setOpen(true)}>
          Add New
        </Button>
      </Box>
      <Box display="none">
        <PrintEquipment componentPrintRef={componentPrintRef} equipment={printEquipment} />
      </Box>
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