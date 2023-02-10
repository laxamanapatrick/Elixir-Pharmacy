import React, { useEffect, useState } from 'react'
import { Flex, Table, Tbody, Td, Th, Thead, Tr, useDisclosure, Button } from '@chakra-ui/react'
import apiClient from '../../../services/apiClient'
import PageScrollReusable from '../../../components/PageScroll-Reusable'

const fetchWarehouseReceivingHistoryApi = async (dateFrom, dateTo) => {
  const res = await apiClient.get(`Report/WarehouseReceivingReport?dateFrom=${dateFrom}&dateTo=${dateTo}`)
  return res.data
}

export const WarehouseReceivingHistory = ({ dateFrom, dateTo, sample, setSheetData }) => {

  const [warehouseData, setWarehouseData] = useState([])
  const [buttonChanger, setButtonChanger] = useState(true)

  const fetchWarehouseReceivingHistory = () => {
    fetchWarehouseReceivingHistoryApi(dateFrom, dateTo, sample).then(res => {
      setWarehouseData(res)
      setSheetData(
        res?.map((item, i) => {
          return {
            'Line Number': i + 1,
            'ID': item.warehouseId,
            'QC Date': item.receiveDate,
            'PO Number': item.poNumber,
            'Item Code': item.itemCode,
            'Item Description': item.itemDescription,
            'UOM': item.uom,
            'Category': item.category ? item.category : 'Miscellaneous',
            'Quantity': item.quantity,
            'Manufacturing Date': item.manufacturingDate,
            'Expiration Date': item.expirationDate,
            'Total Reject': item.totalReject,
            'Supplier': item.supplierName,
            'Transaction Type': item.transactionType,
            'Received By': item.receivedBy,
          }
        })
      )
    })
  }

  useEffect(() => {
    fetchWarehouseReceivingHistory()

    return () => {
      setWarehouseData([])
    }
  }, [dateFrom, dateTo, sample])

  console.log(warehouseData)

  return (
    <Flex w='full' flexDirection='column'>
      <Flex border='1px'>
        <PageScrollReusable minHeight='800px' maxHeight='820px'>
          <Table size='sm'>
            <Thead bgColor='secondary'>
              <Tr>
                <Th color='white'>ID</Th>
                <Th color='white'>QC Date</Th>
                <Th color='white'>PO Number</Th>
                {
                  buttonChanger ?
                    <>
                      <Th color='white'>Item Code</Th>
                      <Th color='white'>Item Description</Th>
                      <Th color='white'>UOM</Th>
                      <Th color='white'>Category</Th>
                      <Th color='white'>Quantity</Th>
                      <Th color='white'>Manufacturing Date</Th>
                    </>
                    :
                    <>
                      <Th color='white'>Expiration Date</Th>
                      <Th color='white'>Total Reject</Th>
                      <Th color='white'>Supplier</Th>
                      <Th color='white'>Transaction Type</Th>
                      <Th color='white'>Received By</Th>
                    </>
                }
              </Tr>
            </Thead>
            <Tbody>
              {
                warehouseData?.map((item, i) =>
                  <Tr key={i}>
                    <Td>{item.warehouseId}</Td>
                    <Td>{item.receiveDate}</Td>
                    <Td>{item.poNumber ? item.poNumber : ''}</Td>
                    {
                      buttonChanger
                        ?
                        <>
                          <Td>{item.itemCode}</Td>
                          <Td>{item.itemDescription}</Td>
                          <Td>{item.uom}</Td>
                          <Td>{item.category ? item.category : 'Miscellaneous'}</Td>
                          <Td>{item.quantity}</Td>
                          <Td>{item.manufacturingDate}</Td>
                        </>
                        :
                        <>
                          <Td>{item.expirationDate}</Td>
                          <Td>{item.totalReject}</Td>
                          <Td>{item.supplierName}</Td>
                          <Td>{item.transactionType}</Td>
                          <Td>{item.receivedBy}</Td>
                        </>
                    }
                  </Tr>
                )
              }
            </Tbody>
          </Table>
        </PageScrollReusable>
      </Flex>

      <Flex justifyContent='end' mt={2}>
        <Button size='xs' colorScheme='teal' onClick={() => setButtonChanger(!buttonChanger)}>
          {buttonChanger ? `>>>>` : `<<<<`}
        </Button>
      </Flex>
    </Flex>
  )
}
