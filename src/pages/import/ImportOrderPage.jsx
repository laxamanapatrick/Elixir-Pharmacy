import React, { useState, useRef } from 'react';
import { Box, Button, Flex, HStack, Input, Select, Table, Tbody, Td, Text, Th, Thead, Tr, useDisclosure, useToast } from '@chakra-ui/react';
import PageScrollImport from '../../components/PageScrollImport'
import * as XLSX from 'xlsx'
import apiClient from '../../services/apiClient'
import { ToastComponent } from '../../components/Toast'
import DateConverter from '../../components/DateConverter'
import moment from 'moment';
import { isDisabled } from '@testing-library/user-event/dist/utils';
import { ErrorModal } from '../ordering/orders/Error-Modal';

const ImportOrderPage = () => {

  const [workbook, setWorkbook] = useState([])
  const [excelData, setExcelData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true)
  const [sheetOptions, setSheetOptions] = useState([])
  const toast = useToast()

  const fileClear = useRef()

  const [errorData, setErrorData] = useState([])
  const { isOpen: isError, onOpen: openError, onClose: closeError } = useDisclosure()

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
    let newOrderDate = DateConverter(item.order_date)
    let newDateNeeded = DateConverter(item.date_needed)

    return {
      transactId: item?.transaction_id,
      customerName: item?.customer_name,
      customerPosition: item?.customer_position,
      farmType: item?.farm_type,
      farmCode: item?.farm_code,
      farmName: item?.farm_name,
      orderNo: item?.order_no,
      batchNo: item?.batch_no,
      orderDate: moment(newOrderDate).format("yyyy-MM-DD"),
      dateNeeded: moment(newDateNeeded).format("yyyy-MM-DD"),
      timeNeeded: item?.time_needed,
      transactionType: item?.transaction_type,
      itemCode: item?.item_code,
      itemDescription: item?.item_description,
      uom: item?.uom,
      quantityOrdered: item?.quantity_ordered,
      category: item?.category
    }

  })

  const submitFile = (resultArray) => {
    if (resultArray.length > 0) {
      try {
        setIsLoading(true)
        const res = apiClient.post(`Ordering/AddNewOrders`,
          resultArray.map(item => ({
            transactId: item?.transactId,
            customerName: item?.customerName,
            customerPosition: item?.customerPosition,
            farmType: item?.farmType,
            farmCode: item?.farmCode.toString(),
            farmName: item?.farmName,
            orderNo: item?.orderNo,
            batchNo: item?.batchNo,
            orderDate: moment(item?.orderDate).format('yyyy-MM-DD'),
            dateNeeded: moment(item?.dateNeeded).format('yyyy-MM-DD'),
            timeNeeded: item?.dateNeeded,
            transactionType: item?.transactionType,
            itemCode: item?.itemCode,
            itemDescription: item?.itemDescription,
            uom: item?.uom,
            quantityOrdered: item?.quantityOrdered,
            category: item?.category
          }))
        ).then(res => {
          ToastComponent("Success", "Orders Imported!", "success", toast)
          setIsLoading(false)
          fileClear.current.value = ""
          setExcelData([])
        }).catch(err => {
          setIsLoading(false)
          setErrorData(err.response.data)
          if (err.response.data) {
            openError()
          }
        })
      } catch (error) {
      }
    } else {
      ToastComponent("Error!", "No data provided, please check your import", "error", toast)
    }
  }

  return (
    <Flex w='full'>

      <Flex
        h='820px'
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
                <Th color='white'>Transaction ID</Th>
                  <Th color='white'>Order Date</Th>
                  <Th color='white'>Date Needed</Th>
                  <Th color='white'>Farm</Th>
                  <Th color='white'>Farm Code</Th>
                  <Th color='white'>Category</Th>
                  <Th color='white'>Item Code</Th>
                  <Th color='white'>Item Description</Th>
                  <Th color='white'>UOM</Th>
                  <Th color='white'>Quantity Order</Th>
                </Tr>
              </Thead>
              <Tbody>
                {resultArray?.map((ed, i) =>
                  <Tr key={i}>
                    <Td>{ed.transactId}</Td>
                    <Td>{ed.orderDate}</Td>
                    <Td>{ed.dateNeeded}</Td>
                    <Td>{ed.farmName}</Td>
                    <Td>{ed.farmCode}</Td>
                    <Td>{ed.category}</Td>
                    <Td>{ed.itemCode}</Td>
                    <Td>{ed.itemDescription}</Td>
                    <Td>{ed.uom}</Td>
                    <Td>{ed.quantityOrdered}</Td>
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
                ml={1} w='47%' type='file' p={1} mr={.2} bgColor='white' onChange={(e) => fileHandler(e.target.files)}
              />

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
      {
        isError && (
          <ErrorModal
            isOpen={isError}
            onClose={closeError}
            errorData={errorData}
          />
        )
      }
    </Flex>
  )
};

export default ImportOrderPage;
