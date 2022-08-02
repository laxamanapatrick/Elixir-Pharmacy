import React, { useEffect, useState } from 'react'
import { Flex, Table, Tbody, Td, Th, Thead, Tr, useDisclosure, Button } from '@chakra-ui/react'
import apiClient from '../../../services/apiClient'
import PageScrollReusable from '../../../components/PageScroll-Reusable'

const fetchSummaryOrdersApi = async (dateFrom, dateTo) => {
  const res = await apiClient.get(`Report/MoveOrderHistory?dateFrom=${dateFrom}&dateTo=${dateTo}`)
  return res.data
}

export const SummaryofOrders = ({ dateFrom, dateTo, sample }) => {

  const [ordersData, setOrdersData] = useState([])
  const [buttonChanger, setButtonChanger] = useState(true)

  const fetchSummaryOrders = () => {
    fetchSummaryOrdersApi(dateFrom, dateTo, sample).then(res => {
      setOrdersData(res)
    })
  }

  useEffect(() => {
    fetchSummaryOrders()

    return () => {
      setOrdersData([])
    }
  }, [dateFrom, dateTo, sample])

  const { } = useDisclosure()

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
                      <Th color='white'>item_desc</Th>
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
              <Tr>
                <Td>Body</Td>
                <Td>Body</Td>
                <Td>Body</Td>
                {
                  buttonChanger
                    ?
                    <>
                      <Td>Body</Td>
                      <Td>Body</Td>
                      <Td>Body</Td>
                      <Td>Body</Td>
                      <Td>Body</Td>
                      <Td>Body</Td>
                    </>
                    :
                    <>
                      <Td>Body</Td>
                      <Td>Body</Td>
                      <Td>Body</Td>
                    </>
                }
              </Tr>
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
