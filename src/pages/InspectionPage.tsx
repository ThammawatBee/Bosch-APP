import { Equipment } from "@/interface/CreateEquipmentForm"
import useInspectionEquipmentStore from "../store/inspectionStore"
import { Button } from "../components/ui/button";
import { Box, Table, Text, Input, NativeSelectField, NativeSelectRoot, IconButton, HStack } from "@chakra-ui/react"
import { DateTime } from "luxon"
import { useEffect, useRef, useState } from "react"
import { LuPrinter } from "react-icons/lu";
import { Field } from "../components/ui/field"
import "../DatePicker.css";
import DatePicker from "react-datepicker"
import PrintEquipment from "../components/print/PrintEquipment"
import { useReactToPrint } from "react-to-print"
import { PaginationItems, PaginationNextTrigger, PaginationPrevTrigger, PaginationRoot } from "../components/ui/pagination";
import axios from "axios"
import PageSizeSelect from "../components/PageSizeSelect"
import pickBy from "lodash/pickBy"

const InspectionPage = () => {
  const { equipments, fetchInspectionEquipments, inspectDate, setSearch, search, setInspectDate, count, limit, offset, onPageChange, onPageSizeChange } = useInspectionEquipmentStore()
  useEffect(() => {
    if (!equipments) {
      fetchInspectionEquipments()
    }
  }, [])
  const calculateDateDifferent = (equipment: Equipment) => {
    const diff = DateTime.fromISO(equipment.nextInspection).diff(DateTime.fromJSDate(inspectDate), 'days').toObject().days!
    return diff > 0 ? Math.ceil(diff) : Math.ceil(diff)
  }

  const changeDaysUntilInspectionToNumber = (daysUntilInspection: string) => {
    const day = +daysUntilInspection
    return day > 0 ? Math.ceil(day) : Math.ceil(day)
  }

  const getCurrentEquipmentNo = (equipment: Equipment) => {
    return `${DateTime.fromJSDate(inspectDate).toFormat('ddMMyy')}-${equipment.equipmentNumber.split('-')[1]}`
  }
  const [printEquipment, setPrintEquipment] = useState<Equipment | null>(null)
  const [exportLoading, setExportLoading] = useState(false)

  const componentPrintRef = useRef(null);
  const printFn = useReactToPrint({
    contentRef: componentPrintRef,
    onAfterPrint: () => {
      setPrintEquipment(null)
    }
  });

  useEffect(() => {
    if (printEquipment) {
      printFn()
    }
  }, [printEquipment])

  const handleExportEquipment = async () => {
    const apiUrl = `${process.env.REACT_APP_SERVICE_URL}/inspection-equipments/export`; // Replace with your API endpoint
    setExportLoading(true)
    try {
      const response = await axios.get(apiUrl, {
        responseType: 'blob', // Handle response as Blob
        headers: {
          Accept: 'text/csv; charset=utf-8',
        },
        params: { ...pickBy(search, search => !!search), inspectDate: DateTime.fromJSDate(inspectDate).toFormat('dd-MM-yyyy') }
      });

      // Create a Blob URL for the downloaded CSV
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);

      // Trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `inspection-equipment ${DateTime.now().toFormat('dd-MM-yyyy HH:mm')}.csv`); // File name
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
    <Text color="#3D4D99" fontWeight="bold" textStyle="lg" mb="15px">Inspection List</Text>
    <Box mb="10px">
      <Field label="Inspection Day" width="23%">
        <DatePicker
          dateFormat="dd-MM-yyyy"
          showMonthDropdown
          showYearDropdown
          selected={inspectDate}
          onChange={(date) => {
            setInspectDate(date)
          }}
          customInput={<Input readOnly background={'white'} />}
        />
      </Field>
    </Box>
    <Box mt="10px" display="flex" mb="15px" justifyContent='space-between'>
      <Field label="Area" width="23%">
        <Input
          background={'white'}
          value={search.area}
          onChange={(e) => {
            setSearch({ area: e.currentTarget.value })
          }} />
      </Field>
      <Field label="Equipment No." width="23%">
        <Input
          background={'white'}
          value={search.equipmentNumber}
          onChange={(e) => {
            setSearch({ equipmentNumber: e.currentTarget.value })
          }} />
      </Field>
      <Field label="Name" width="23%">
        <Input background={'white'}
          value={search.name}
          onChange={(e) => {
            setSearch({ name: e.currentTarget.value })
          }} />
      </Field>
      <Field label="Brand" width="23%">
        <Input background={'white'}
          value={search.brand}
          onChange={(e) => {
            setSearch({ brand: e.currentTarget.value })
          }} />
      </Field>
    </Box>
    <Button variant="solid" size="lg" fontWeight="bold" mb="20px"
      onClick={async () => {
        await fetchInspectionEquipments({ offset: 0, reset: true })
      }}
    >
      Search
    </Button>
    <Box mb="15px">
      <Table.Root size="md">
        <Table.Header>
          <Table.Row background={"#F6F6F6"}>
            <Table.ColumnHeader>Remaining Days</Table.ColumnHeader>
            <Table.ColumnHeader>Area</Table.ColumnHeader>
            <Table.ColumnHeader>Type</Table.ColumnHeader>
            <Table.ColumnHeader>New Equipment No.</Table.ColumnHeader>
            <Table.ColumnHeader>Current Equipment No.</Table.ColumnHeader>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Brand</Table.ColumnHeader>
            <Table.ColumnHeader>Inspection Period</Table.ColumnHeader>
            <Table.ColumnHeader>Next Inspection</Table.ColumnHeader>
            <Table.ColumnHeader>Expired Date</Table.ColumnHeader>
            <Table.ColumnHeader></Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {equipments?.length ? equipments.slice(offset * limit, (offset + 1) * limit).map((equipment) => (
            <Table.Row key={equipment.id} style={{
              ...DateTime.fromJSDate(inspectDate) > DateTime.fromISO(equipment.nextInspection) ? {
                color: '#EE5153',
              } : {}
            }}>
              <Table.Cell>{changeDaysUntilInspectionToNumber(equipment.daysUntilInspection)}</Table.Cell>
              <Table.Cell>{equipment.area || ''}</Table.Cell>
              <Table.Cell>{equipment.type}</Table.Cell>
              <Table.Cell>{getCurrentEquipmentNo(equipment)}</Table.Cell>
              <Table.Cell>{equipment.equipmentNumber}</Table.Cell>
              <Table.Cell>{equipment.name}</Table.Cell>
              <Table.Cell>{equipment.brand}</Table.Cell>
              <Table.Cell>{equipment.inspectionPeriod} Month</Table.Cell>
              <Table.Cell>{DateTime.fromISO(equipment.nextInspection).toFormat('dd-MM-yyyy')}</Table.Cell>
              <Table.Cell>{DateTime.fromISO(equipment.expiredDate).toFormat('dd-MM-yyyy')}</Table.Cell>
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
      <Button variant="solid" size="lg" fontWeight="bold" onClick={() => handleExportEquipment()} loading={exportLoading} marginRight={'15px'}>Export</Button>
    </Box>
    <Box display="none">
      <PrintEquipment componentPrintRef={componentPrintRef} equipment={printEquipment} />
    </Box>
  </Box>
}
export default InspectionPage