import React, { useEffect, useState } from 'react'
import { Flex, Table, Tbody, Td, Th, Thead, Tr, useDisclosure, Button } from '@chakra-ui/react'
import apiClient from '../../../services/apiClient'
import PageScrollReusable from '../../../components/PageScroll-Reusable'
import moment from 'moment'

const fetchMoveOrderHistoryApi = async (dateFrom, dateTo) => {
  const datePlusOne = new Date(dateTo)
  const dateToDaya = moment(datePlusOne?.setDate(datePlusOne?.getDate() + 1)).format("YYYY-MM-DD")
  const res = await apiClient.get(`Report/MoveOrderHistory?dateFrom=${dateFrom}&dateTo=${dateToDaya}`)
  return res.data
}

export const MoveOrderTransactionHistory = ({ dateFrom, dateTo, sample, setSheetData }) => {

  const [moData, setMoData] = useState([])
  const [buttonChanger, setButtonChanger] = useState(true)

  const fetchMoveOrderHistory = () => {
    fetchMoveOrderHistoryApi(dateFrom, dateTo, sample).then(res => {
      setMoData(res)
      setSheetData(
        res?.map((item, i) => {
          return {
            'Line Number': i + 1,
            'Move Order Id': item.moveOrderId,
            'Customer Code': item.customerCode,
            'Customer Name': item.customerName,
            'Item Code': item.itemCode,
            'Item Description': item.itemDescription,
            'UOM': item.uom,
            'Category': item.category,
            'Quantity': item.quantity,
            'Batch Number': item.batchNo,
            'Expiration Date': item.expirationDate ? moment(item.expirationDate).format('yyyy-MM-DD') : '',
            'Transaction Type': item.transactionType,
            'Move Order Date': item.moveOrderDate ? moment(item.moveOrderDate).format('yyyy-MM-DD') : '',
            'Move Order By': item.moveOrderBy,
            'Status': item.transactedDate ? 'Transacted' : 'For Transaction',
            'Transacted Date': item.transactedDate ? moment(item.transactedDate).format('yyyy-MM-DD') : '',
            'Transacted By': item.transactedBy ? item.transactedBy : ''
          }
        })
      )
    })
  }

  useEffect(() => {
    fetchMoveOrderHistory()

    return () => {
      setMoData([])
    }
  }, [dateFrom, dateTo, sample])

  return (
    <Flex w='full' flexDirection='column'>
      <Flex border='1px'>
        <PageScrollReusable minHeight='800px' maxHeight='820px'>
          <Table size='sm'>
            <Thead bgColor='secondary'>
              <Tr>
                <Th color='white'>Move Order ID</Th>
                <Th color='white'>Customer Code</Th>
                <Th color='white'>Customer Name</Th>
                {
                  buttonChanger ?
                    <>
                      <Th color='white'>Item Code</Th>
                      <Th color='white'>Item Description</Th>
                      <Th color='white'>UOM</Th>
                      <Th color='white'>Category</Th>
                      <Th color='white'>Quantity</Th>
                      <Th color='white'>Batch Number</Th>
                      <Th color='white'>Expiration Date</Th>
                    </>
                    :
                    <>
                      <Th color='white'>Transaction Type</Th>
                      {/* <Th color='white'>Prepared Date</Th> */}
                      <Th color='white'>Move Order Date</Th>
                      <Th color='white'>Move Order By</Th>
                      <Th color='white'>Status</Th>
                      <Th color='white'>Transacted Date</Th>
                      <Th color='white'>Transacted By</Th>
                    </>
                }
              </Tr>
            </Thead>
            <Tbody>
              {
                moData?.map((item, i) =>
                  <Tr key={i}>
                    <Td>{item.moveOrderId}</Td>
                    <Td>{item.customerCode}</Td>
                    <Td>{item.customerName}</Td>
                    {
                      buttonChanger
                        ?
                        <>
                          <Td>{item.itemCode}</Td>
                          <Td>{item.itemDescription}</Td>
                          <Td>{item.uom}</Td>
                          <Td>{item.category}</Td>
                          <Td>{item.quantity}</Td>
                          <Td>{item.batchNo}</Td>
                          <Td>{item.expirationDate ? moment(item.expirationDate).format('yyyy-MM-DD') : ''}</Td>
                        </>
                        :
                        <>
                          <Td>{item.transactionType}</Td>
                          {/* <Td>{item.moveOrderDate ? moment(item.preparedDate).format('yyyy-MM-DD'): ''}</Td> */}
                          <Td>{item.moveOrderDate ? moment(item.moveOrderDate).format('yyyy-MM-DD'): ''}</Td>
                          <Td>{item.moveOrderBy}</Td>
                          <Td>{item.transactedDate ? 'Transacted' : 'For Transaction'}</Td>
                          <Td>{item.transactedDate ? moment(item.transactedDate).format('yyyy-MM-DD') : ''}</Td>
                          <Td>{item.transactedBy ? item.transactedBy : ''}</Td>
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
