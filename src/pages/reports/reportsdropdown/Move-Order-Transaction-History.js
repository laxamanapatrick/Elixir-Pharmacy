import React, { useEffect, useState } from 'react'
import { Flex, Table, Tbody, Td, Th, Thead, Tr, useDisclosure, Button } from '@chakra-ui/react'
import apiClient from '../../../services/apiClient'
import PageScrollReusable from '../../../components/PageScroll-Reusable'
import moment from 'moment'

const fetchMoveOrderHistoryApi = async (dateFrom, dateTo) => {
  const res = await apiClient.get(`Report/MoveOrderHistory?dateFrom=${dateFrom}&dateTo=${dateTo}`)
  return res.data
}

export const MoveOrderTransactionHistory = ({ dateFrom, dateTo, sample }) => {

  const [moData, setMoData] = useState([])
  const [buttonChanger, setButtonChanger] = useState(true)

  const fetchMoveOrderHistory = () => {
    fetchMoveOrderHistoryApi(dateFrom, dateTo, sample).then(res => {
      setMoData(res)
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
                <Th color='white'>move_order_id</Th>
                <Th color='white'>customer_code</Th>
                <Th color='white'>customer_name</Th>
                {
                  buttonChanger ?
                    <>
                      <Th color='white'>item_code</Th>
                      <Th color='white'>item_description</Th>
                      <Th color='white'>uom</Th>
                      <Th color='white'>category</Th>
                      <Th color='white'>quantity</Th>
                      <Th color='white'>expiration_date</Th>
                    </>
                    :
                    <>
                      <Th color='white'>transaction_type</Th>
                      <Th color='white'>move_order_by</Th>
                      <Th color='white'>move_order_date</Th>
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
                          <Td>{item.moveOrderDate}</Td>
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
