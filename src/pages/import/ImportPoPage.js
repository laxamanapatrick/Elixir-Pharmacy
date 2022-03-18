import React, { useState } from 'react';
import { Box, Button, Flex, HStack, Input, Select, Table, Tbody, Td, Text, Th, Thead, Tr, useToast } from '@chakra-ui/react';
import PageScrollImport from '../../components/PageScrollImport'
import * as XLSX from 'xlsx'
import apiClient from '../../services/apiClient'
import { ToastComponent } from '../../components/Toast'
import DateConverter from '../../components/DateConverter'
import moment from 'moment';

const ImportPoPage = () => {

  const [workbook, setWorkbook] = useState([])
  const [excelData, setExcelData] = useState([])
  const [isLoading, setisLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true)
  const [sheetOptions, setSheetOptions] = useState([])
  const toast = useToast()

  const fileRenderer = (jsonData) => {
    jsonData.forEach((row) => {
      Object.keys(row).forEach((key) => {
        let newKey = key.trim().toLowerCase().replace(/ /g, "_")
        if (key !== newKey) {
          row[newKey] = row[key]
          delete row[key]
        }
      })
    })
    setExcelData(jsonData)
  }

  const fileHandler = async (e) => {
    const file = e[0]
    const data = await file.arrayBuffer()
    const workbook = XLSX.readFile(data)

    setWorkbook(workbook)
    setSheetOptions(workbook.SheetNames)

    const initialWorkSheet = workbook.Sheets[workbook.SheetNames[0]]
    const jsonData = XLSX.utils.sheet_to_json(initialWorkSheet)

    fileRenderer(jsonData)
    if (e) {
      setIsDisabled(false)
    } else {
      setIsDisabled(true)
    }
  }

  const sheetNumberHandlder = (data = 0) => {
    const worksheet = workbook.Sheets[workbook.SheetNames[data]]
    const jsonData = XLSX.utils.sheet_to_json(worksheet)

    fileRenderer(jsonData)
    if (data) {
      setIsDisabled(false)
    } 
  }

  const resultArray = excelData.map(item => {
    let newPrDate = DateConverter(item.pr_date)
    let newPoDate = DateConverter(item.po_date)

    return {
      pR_number: item.pr_number,
      pR_date: moment(newPrDate).format("YYYY-MM-DD"),
      pO_number: item.po_number,
      pO_date: moment(newPoDate).format("YYYY-MM-DD"),
      itemCode: item.item_code,
      itemDescription: item.item_description,
      ordered: item.qty_ordered,
      delivered: item.qty_delivered,
      billed: item.qty_billed,
      uom: item.uom,
      unitPrice: item.unit_price,
      vendorName: item.vendor_name
    }

  })



  const submitFile = (resultArray) => {
    try {
      setisLoading(true)
      const res = apiClient.post('Import/AddNewPOManual', resultArray).then((res) => {
        ToastComponent("Success!", "PO Imported", "success", toast)
        setisLoading(false)
        setIsDisabled(true)
      }).catch(err => {
        setisLoading(false)
        ToastComponent("Error", err.response.data, "error", toast)
      })
    } catch (err) {
    }
  }

  return (
    <Flex w='full'>

      <Flex
        h='780px'
        ml='2%'
        mt='2%'
        w='96%'
        bgColor='white'
        flexDirection='column'
        border='2px'
        borderWidth='5px'
        borderColor='secondary'
        justifyContent='space-between'
      >
        <Flex>

          <PageScrollImport>

            <Table variant='striped' size="sm">
              <Thead bgColor='secondary'>
                <Tr>
                  {/* <Th color='white'>ID</Th> */}
                  <Th color='white'>PR Number</Th>
                  <Th color='white'>PR Date</Th>
                  <Th color='white'>PO Number</Th>
                  <Th color='white'>PO Date</Th>
                  <Th color='white'>Item Code</Th>
                  <Th color='white'>Item Description</Th>
                  <Th color='white'>Ordered</Th>
                  <Th color='white'>Delivered</Th>
                  <Th color='white'>Billed</Th>
                  <Th color='white'>UOM</Th>
                  <Th color='white'>Unit Price</Th>
                  <Th color='white'>Vendor Name</Th>
                </Tr>
              </Thead>
              <Tbody>
                {resultArray?.map((ed, i) =>
                  <Tr key={i}>
                    {/* <Td>{ }</Td> */}
                    <Td>{ed.pR_number}</Td>
                    <Td>{ed.pR_date}</Td>
                    <Td>{ed.pO_number}</Td>
                    <Td>{ed.pO_date}</Td>
                    <Td>{ed.itemCode}</Td>
                    <Td>{ed.itemDescription}</Td>
                    <Td>{ed.ordered}</Td>
                    <Td>{ed.delivered}</Td>
                    <Td>{ed.billed}</Td>
                    <Td>{ed.uom}</Td>
                    <Td>{ed.unitPrice}</Td>
                    <Td>{ed.vendorName}</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>

          </PageScrollImport>
        </Flex>

        <Box p={2} bgColor='secondary'>
          <Flex justifyContent='space-between'>
            <Flex w='50%' justifyContent='start'>
              {/* <Text color='white'>Filename:</Text>
              <Input readOnly={true} w='full' pr='150px' bgColor='white' mr={1} placeholder={fileName} /> */}

              <Input ml={1} w='47%' type='file' p={1} mr={.2} bgColor='white' onChange={(e) => fileHandler(e.target.files)} />

              <Select
                onChange={(e) => sheetNumberHandlder(e.target.selectedIndex)}
                w='31%'
                ml={2}
                bgColor='white'
              >
                {sheetOptions?.map((sh, i) =>

                  (<option key={i}>{sh}</option>)
                )}
              </Select>


            </Flex>
            <HStack>

              <Button
                onClick={() => submitFile(resultArray)}
                type='submit'
                isLoading={isLoading}
                isDisabled={isDisabled}
                _hover={{ color: 'white', bgColor: 'accent' }}
              >
                Import
              </Button>
            </HStack>
          </Flex>
        </Box>

      </Flex>

    </Flex>
  )
};

export default ImportPoPage;
