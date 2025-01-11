import useReportStore, { generateReportParam } from "../store/reportStore";
import { FileUploadRoot, FileUploadTrigger } from "../components/ui/file-upload"
import { Field } from "../components/ui/field"
import { Box, Table, Text, NativeSelectField, NativeSelectRoot, Input, HStack } from "@chakra-ui/react"
import { Button } from "../components/ui/button";
import Papa from 'papaparse';
import { ReportFromFile } from "@/interface/Report";
import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import DatePicker from "react-datepicker"
import { PaginationItems, PaginationNextTrigger, PaginationPrevTrigger, PaginationRoot } from "../components/ui/pagination";
import "../DatePicker.css";
import { toast } from "react-toastify"
import axios from "axios"
import PageSizeSelect from "../components/PageSizeSelect";


const ReportPage = () => {
  const { createReports, fetchReports, reports, search, setSearch, count, limit, offset, onPageChange, onPageSizeChange, resetReportList } = useReportStore()
  useEffect(() => {
    if (!reports) {
      fetchReports()
    }
  }, [])

  const [exportLoading, setExportLoading] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)

  const handleExportReport = async () => {
    const apiUrl = `${process.env.REACT_APP_SERVICE_URL}/reports/export`; // Replace with your API endpoint
    setExportLoading(true)
    try {
      const response = await axios.get(apiUrl, {
        responseType: 'blob', // Handle response as Blob
        headers: {
          Accept: 'text/csv; charset=utf-8',
        },
        params: generateReportParam(search)
      });

      // Create a Blob URL for the downloaded CSV
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      // Trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report ${DateTime.now().toFormat('dd-MM-yyyy HH:mm')}.csv`); // File name
      document.body.appendChild(link);
      link.click();
      link.remove();
      setExportLoading(false)
    } catch (error) {
      console.error('Error downloading CSV:', error)
      setExportLoading(false)
    }
  }


  const handleUploadFile = (file: File) => {
    setUploadLoading(true)
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      //chunkSize: 1024 * 1024, // Set chunk size to 1MB
      chunkSize: 1024 * 1024,
      chunk: async (results, parser) => {
        parser.pause(); // Pause parsing until the current chunk is uploaded
        const data = results.data as unknown as ReportFromFile[]
        await createReports(data.map(data => ({
          equipmentNumber: data["Equipment number"],
          result: data.Result,
          resultDate: data.ResultDate,
          nokReason: data.nokReason,
          investigatedBy: data["Staff name"],
        })))
        try {
          // await uploadChunk(results.data); // Send the chunk to the server
          parser.resume(); // Resume parsing after successful upload
        } catch (error) {
          console.error('Error uploading chunk:', error);
          parser.abort(); // Stop processing further
        }
      },
      complete: async () => {
        toast.success('Upload report success', {
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
        setUploadLoading(false)
        await resetReportList()
      },
      error: (error: any) => {
        setUploadLoading(false)
        console.error('Error parsing CSV:', error);
      },
    })
  }


  return <Box backgroundColor={'white'} padding="20px" borderRadius={'8px'}>
    <Text color="#3D4D99" fontWeight="bold" textStyle="lg" mb="15px">Result Report</Text>
    <Box mt="10px" display="flex" mb="15px" justifyContent='space-between'>
      <Field label="Result" width="18%">
        <NativeSelectRoot background={'white'} borderRadius={'8px'}>
          <NativeSelectField
            placeholder="All Result"
            value={search?.status}
            onChange={(e) => setSearch({ result: e.currentTarget.value })}
          >
            <option value={"OK"}>OK</option>
            <option value={"NOK"}>NOK</option>
          </NativeSelectField>
        </NativeSelectRoot>
      </Field>
      <Field label="Type" width="18%">
        <NativeSelectRoot background={'white'} borderRadius={'8px'}>
          <NativeSelectField
            placeholder="All type"
            value={search?.type}
            onChange={(e) => {
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
          onChange={(e) => {
            setSearch({ equipmentNumber: e.currentTarget.value })
          }} />
      </Field>
      <Field label="Name" width="18%">
        <Input background={'white'}
          onChange={(e) => {
            setSearch({ name: e.currentTarget.value })
          }} />
      </Field>
      <Field label="Brand" width="18%">
        <Input background={'white'} onChange={(e) => {
          setSearch({ brand: e.currentTarget.value })
        }} />
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
            setSearch({ resultDateStart: start, resultDateEnd: end })
          }}
          selectsRange={true}
          startDate={search?.resultDateStart}
          endDate={search?.resultDateEnd}
          onKeyDown={(e) => e.preventDefault()}
          customInput={<Input
            readOnly={true}
            value={search?.resultDateStart ? DateTime.fromJSDate(search.resultDateStart).toFormat('dd-MM-yyyy') : ''}
            background={'white'} />}
        />
      </Field>
    </Box>
    <Button variant="solid" size="lg" fontWeight="bold" mb="20px"
      onClick={async () => {
        await fetchReports({ offset: 0, reset: true })
      }}
    >
      Search
    </Button>
    <Box mb="15px">
      <Table.Root size="md">
        <Table.Header>
          <Table.Row background={"#F6F6F6"}>
            <Table.ColumnHeader>Result</Table.ColumnHeader>
            <Table.ColumnHeader>Type</Table.ColumnHeader>
            <Table.ColumnHeader>Result Date</Table.ColumnHeader>
            <Table.ColumnHeader>Staff Name</Table.ColumnHeader>
            <Table.ColumnHeader>Equipment No.</Table.ColumnHeader>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Brand</Table.ColumnHeader>
            <Table.ColumnHeader>Inspection Period</Table.ColumnHeader>
            <Table.ColumnHeader>Next Inspection</Table.ColumnHeader>
            <Table.ColumnHeader>Expired Date</Table.ColumnHeader>
            <Table.ColumnHeader>NOK Reason</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {reports?.length ? reports.map(report => <Table.Row>
            <Table.Cell color={report.result === 'NOK' ? '#DA695D' : 'black'}>{report.result}</Table.Cell>
            <Table.Cell>{report.type}</Table.Cell>
            <Table.Cell>{DateTime.fromISO(report.resultDate).toFormat('dd-MM-yyyy')}</Table.Cell>
            <Table.Cell>{report.investigatedBy || ''}</Table.Cell>
            <Table.Cell>{report.equipmentNumber}</Table.Cell>
            <Table.Cell>{report.name}</Table.Cell>
            <Table.Cell>{report.brand}</Table.Cell>
            <Table.Cell>{report.inspectionPeriod} Month</Table.Cell>
            <Table.Cell>{DateTime.fromISO(report.nextInspection).toFormat('dd-MM-yyyy')}</Table.Cell>
            <Table.Cell>{DateTime.fromISO(report.expiredDate).toFormat('dd-MM-yyyy')}</Table.Cell>
            <Table.Cell>{report.nokReason}</Table.Cell>
          </Table.Row>) : <Box height={'75px'} />}
        </Table.Body>
      </Table.Root>
      {reports?.length ? <Box mt={'15px'} mb={'15px'} display='flex' justifyContent={'space-between'}>
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
      <FileUploadRoot width={'100px'} accept={".csv"} onFileChange={async (file) => {
        if (file.acceptedFiles?.[0]) {
          handleUploadFile(file.acceptedFiles?.[0])
        }
      }}>
        <FileUploadTrigger asChild>
          <Button size="lg" fontWeight="bold">
            Upload file
          </Button>
        </FileUploadTrigger>
      </FileUploadRoot>
      <Button ml="50px" variant="solid" size="lg" fontWeight="bold" onClick={() => handleExportReport()} marginRight={'15px'} loading={exportLoading}>Export</Button>
    </Box>
  </Box>
}

export default ReportPage