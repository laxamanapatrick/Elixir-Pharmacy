import React, { useState, useRef } from 'react';
import { Box, Button, Flex, HStack, Input, Select, Table, Tbody, Td, Text, Th, Thead, Tr, useDisclosure, useToast } from '@chakra-ui/react';
import PageScrollImport from '../../components/PageScrollImport'
import * as XLSX from 'xlsx'
import apiClient from '../../services/apiClient'
import { ToastComponent } from '../../components/Toast'
import DateConverter from '../../components/DateConverter'
import moment from 'moment';
import { decodeUser } from '../../services/decode-user';
import ErrorList from './import-po/Error-List';

const currentUser = decodeUser()

const ImportPoPage = () => {

  const [workbook, setWorkbook] = useState([])
  const [excelData, setExcelData] = useState([])
  const [isLoading, setisLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true)
  const [sheetOptions, setSheetOptions] = useState([])

  const [errorOpener, setErrorOpener] = useState(false)

  const [errorData, setErrorData] = useState([])

  const toast = useToast()

  const { isOpen: isErrorListOpen, onOpen: openErrorList, onClose: closeErrorList } = useDisclosure()

  const fileClear = useRef()

  const fileRenderer = (jsonData) => {

    setExcelData([])

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

    setWorkbook([])
    
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

    // setSheetOptions([])

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
      itemCode: item.item_code.toString(),
      itemDescription: item.item_description,
      ordered: item.qty_ordered,
      delivered: item.qty_delivered,
      billed: item.qty_billed,
      uom: item.uom,
      unitPrice: item.unit_price,
      vendorName: item.vendor_name?.trimEnd(),
      addedBy: currentUser.fullName
    }

  })

  const submitFile = (resultArray) => {
    if (resultArray.length > 0) {

      try {
        setisLoading(true)
        const res = apiClient.post('Import/AddNewPOManual', resultArray).then((res) => {
          ToastComponent("Success!", "PO Imported", "success", toast)
          setisLoading(false)
          setIsDisabled(true)
          fileClear.current.value = ""
          setExcelData([])
        }).catch(err => {
          setisLoading(false)
          ToastComponent("Error", "Import Failed, Please check your fields.", "error", toast)
          setErrorData(err.response.data)
          if (err.response.data) {
            setErrorOpener(true)
            openErrorList()
          }
        })
      } catch (err) {
        ToastComponent("Error!", "Wrong excel format imported for PO", "error", toast)
      }

    } else {
      ToastComponent("Error!", "No data provided, please check your import", "error", toast)
    }
  }

  const openErrorModal = () => {
    openErrorList()
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
                    <Td>{ed.pR_number ? ed.pR_number : <Text fontWeight='semibold' color='danger'>Data missing. Please make sure correct excel file for PO is uploaded.</Text>}</Td>
                    <Td>{ed.pR_date ? ed.pR_date : <Text fontWeight='semibold' color='danger'>Data missing. Please make sure correct excel file for PO is uploaded.</Text>}</Td>
                    <Td>{ed.pO_number ? ed.pO_number : <Text fontWeight='semibold' color='danger'>Data missing. Please make sure correct excel file for PO is uploaded.</Text>}</Td>
                    <Td>{ed.pO_date ? ed.pO_date : <Text fontWeight='semibold' color='danger'>Data missing. Please make sure correct excel file for PO is uploaded.</Text>}</Td>
                    <Td>{ed.itemCode ? ed.itemCode : <Text fontWeight='semibold' color='danger'>Data missing. Please make sure correct excel file for PO is uploaded.</Text>}</Td>
                    <Td>{ed.itemDescription ? ed.itemDescription : <Text fontWeight='semibold' color='danger'>Data missing. Please make sure correct excel file for PO is uploaded.</Text>}</Td>
                    <Td>{ed.ordered ? ed.ordered : <Text fontWeight='semibold' color='danger'>Data missing. Please make sure correct excel file for PO is uploaded.</Text>}</Td>
                    <Td>{ed.delivered < 0 ? <Text fontWeight='semibold' color='danger'>Data missing. Please make sure correct excel file for PO is uploaded.</Text> : ed.delivered}</Td>
                    <Td>{ed.billed < 0 ? <Text fontWeight='semibold' color='danger'>Data missing. Please make sure correct excel file for PO is uploaded.</Text> : ed.billed}</Td>
                    <Td>{ed.uom ? ed.uom : <Text fontWeight='semibold' color='danger'>Data missing. Please make sure correct excel file for PO is uploaded.</Text>}</Td>
                    <Td>{ed.unitPrice ? ed.unitPrice : <Text fontWeight='semibold' color='danger'>Data missing. Please make sure correct excel file for PO is uploaded.</Text>}</Td>
                    <Td>{ed.vendorName ? ed.vendorName : <Text fontWeight='semibold' color='danger'>Data missing. Please make sure correct excel file for PO is uploaded.</Text>}</Td>
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

              {
                errorOpener === true ? (
                  <Button
                    onClick={() => openErrorModal()}
                    type='submit'
                    isLoading={isLoading}
                    isDisabled={isDisabled}
                    _hover={{ color: 'white', bgColor: 'accent' }}
                    color='danger'
                  >
                    Errors Found
                  </Button>
                )
                  :
                  (
                    <Button
                      onClick={() => submitFile(resultArray)}
                      type='submit'
                      isLoading={isLoading}
                      isDisabled={isDisabled}
                      _hover={{ color: 'white', bgColor: 'accent' }}
                    >
                      Import
                    </Button>
                  )
              }

            </HStack>
          </Flex>
        </Box>

      </Flex>

      {
        isErrorListOpen && (
          <ErrorList
            isOpen={isErrorListOpen}
            onClose={closeErrorList}
            onOpen={openErrorList}
            errorData={errorData}
          />
        )
      }

    </Flex>
  )
};

export default ImportPoPage;
