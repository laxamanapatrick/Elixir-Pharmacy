import React, { useEffect, useState } from 'react'
import { Flex, Table, Tbody, Td, Th, Thead, Tr, useDisclosure, Button } from '@chakra-ui/react'
import apiClient from '../../../services/apiClient'
import PageScrollReusable from '../../../components/PageScroll-Reusable'
import moment from 'moment'

const fetchTransactedMoveOrdersApi = async (dateFrom, dateTo) => {
  const res = await apiClient.get(`Report/TransactedMoveOrderReport?dateFrom=${dateFrom}&dateTo=${dateTo}`)
  return res.data
}

export const TransactedMoveOrders = ({ dateFrom, dateTo, sample }) => {

  const [tmoData, setTMOData] = useState([])
  const [buttonChanger, setButtonChanger] = useState(true)

  const fetchTransactedMoveOrders = () => {
    fetchTransactedMoveOrdersApi(dateFrom, dateTo).then(res => {
      setTMOData(res)
    })
  }

  useEffect(() => {
    fetchTransactedMoveOrders()

    return () => {
      setTMOData([])
    }
  }, [dateFrom, dateTo])

  return (
    <Flex w='full' flexDirection='column'>
      <Flex border='1px'>
        <PageScrollReusable minHeight='800px' maxHeight='820px'>
          <Table size='sm'>
            <Thead bgColor='secondary'>
              <Tr>
                <Th color='white'>Order ID</Th>
                <Th color='white'>Customer Code</Th>
                <Th color='white'>Customer Name</Th>
                <Th color='white'>Item Code</Th>
                <Th color='white'>Item Description</Th>
                <Th color='white'>Total Quantity</Th>
                <Th color='white'>Transaction Date</Th>
                <Th color='white'>Transaction Type</Th>
                <Th color='white'>Transacted By</Th>
              </Tr>
            </Thead>
            <Tbody>
              {
                tmoData?.map((item, i) =>
                  <Tr key={i}>
                    <Td>{item.orderNo}</Td>
                    <Td>{item.customerCode}</Td>
                    <Td>{item.customerName}</Td>
                    <Td>{item.itemCode}</Td>
                    <Td>{item.itemDescription}</Td>
                    <Td>{item.quantity}</Td>
                    <Td>{moment(item.transactedDate).format('yyyy-MM-DD')}</Td>
                    <Td>{item.transactionType}</Td>
                    <Td>{item.transactedBy}</Td>
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
