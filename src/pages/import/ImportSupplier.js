import React, { useState, useRef } from 'react';
import { Box, Button, Flex, HStack, Input, Select, Table, Tbody, Td, Text, Th, Thead, Tr, useToast } from '@chakra-ui/react';
import PageScrollImport from '../../components/PageScrollImport'
import * as XLSX from 'xlsx'
import apiClient from '../../services/apiClient'
import { ToastComponent } from '../../components/Toast'
import DateConverter from '../../components/DateConverter'
import moment from 'moment';
import { isDisabled } from '@testing-library/user-event/dist/utils';

const ImportSupplier = () => {

  const [workbook, setWorkbook] = useState([])
  const [excelData, setExcelData] = useState([])
  const [isLoading, setisLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true)
  const [sheetOptions, setSheetOptions] = useState([])
  const toast = useToast()

  const fileClear = useRef()

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

    return {
      supplierCode: item.supplier_code,
      supplierName: item.supplier_name,
      supplierAddress: item.supplier_address
    }

  })

  const submitFile = (resultArray) => {
    if (resultArray.length > 0) {
      try {
        setisLoading(true)
        const res = apiClient.post('Import/AddNewSupplierSummary', resultArray).then((res) => {
          ToastComponent("Success!", "Supplier(s) Imported", "success", toast)
          setisLoading(false)
          setIsDisabled(true)
          fileClear.current.value = ""
          setExcelData([])
        }).catch(err => {
          setisLoading(false)
          ToastComponent("Error", err.response.data, "error", toast)
        })
      } catch (err) {
      }
    } else {
      ToastComponent("Error!", "No data provided, please check your import", "error", toast)
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
                  <Th color='white'> </Th>
                  <Th color='white'>Supplier Code</Th>
                  <Th color='white'>Supplier Name</Th>
                  <Th color='white'>Supplier Address</Th>
                  <Th color='white'> </Th>
                </Tr>
              </Thead>
              <Tbody>
                {resultArray?.map((ed, i) =>
                  <Tr key={i}>
                    <Td> </Td>
                    <Td>{ed.supplierCode ? ed.supplierCode : <Text fontWeight='semibold' color='danger'>Data missing. Please make sure correct excel file for suppliers is uploaded.</Text>}</Td>
                    <Td>{ed.supplierName ? ed.supplierName : <Text fontWeight='semibold' color='danger'>Data missing. Please make sure correct excel file for suppliers is uploaded.</Text>}</Td>
                    <Td>{ed.supplierAddress ? ed.supplierAddress : <Text fontWeight='semibold' color='danger'>Data missing. Please make sure correct excel file for suppliers is uploaded.</Text>}</Td>
                    <Td> </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>

          </PageScrollImport>
        </Flex>

        <Box p={2} bgColor='secondary'>
          <Flex justifyContent='space-between'>

            <Flex w='50%' justifyContent='start'>

              <Input 
              ref={fileClear}
              ml={1} w='47%' type='file' p={1} mr={.2} bgColor='white' onChange={(e) => fileHandler(e.target.files)} />

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

export default ImportSupplier;
