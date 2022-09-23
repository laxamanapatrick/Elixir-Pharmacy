import React, { useEffect, useState } from 'react'
import { Flex, Table, Tbody, Td, Th, Thead, Tr, useDisclosure, Button } from '@chakra-ui/react'
import apiClient from '../../../services/apiClient'
import PageScrollReusable from '../../../components/PageScroll-Reusable'
import moment from 'moment'

const fetchMoveOrderHistoryApi = async (dateFrom, dateTo) => {
  const res = await apiClient.get(`Report/MoveOrderHistory?dateFrom=${dateFrom}&dateTo=${dateTo}`)
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
            'Move Order Id': item.moveOrderId ,
            'Customer Code': item.customerCode,
            'Customer Name': item.customerName,
            'Item Code': item.itemCode,
            'Item Description': item.itemDescription,
            'UOM': item.uom,
            'Category': item.category,
            'Quantity': item.quantity,
            'Expiration Date': moment(item.expirationDate).format('yyyy-MM-DD'),
            'Transaction Type': item.transactionType,
            'Move Order By': item.moveOrderBy,
            'Move Order Date': moment(item.moveOrderDate).format('yyyy-MM-DD'),
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
                      <Th color='white'>Expiration Date</Th>
                    </>
                    :
                    <>
                      <Th color='white'>Transaction Type</Th>
                      <Th color='white'>Move Order By</Th>
                      <Th color='white'>Move Order Date</Th>
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
                          <Td>{moment(item.expirationDate).format('yyyy-MM-DD')}</Td>
                        </>
                        :
                        <>
                          <Td>{item.transactionType}</Td>
                          <Td>{item.moveOrderBy}</Td>
                          <Td>{moment(item.moveOrderDate).format('yyyy-MM-DD')}</Td>
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
