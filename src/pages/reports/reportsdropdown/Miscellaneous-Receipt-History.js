import React, { useEffect, useState } from 'react'
import { Flex, Table, Tbody, Td, Th, Thead, Tr, useDisclosure, Button } from '@chakra-ui/react'
import apiClient from '../../../services/apiClient'
import PageScrollReusable from '../../../components/PageScroll-Reusable'
import moment from 'moment'

const fetchMiscellaenouseReceiptApi = async (dateFrom, dateTo) => {
  const res = await apiClient.get(`Report/MiscellaneousReceiptReport?dateFrom=${dateFrom}&dateTo=${dateTo}`)
  return res.data
}

export const MiscellaneousReceiptHistory = ({ dateFrom, dateTo, sample }) => {

  const [miscReceiptData, setMiscReceiptData] = useState([])
  const [buttonChanger, setButtonChanger] = useState(true)

  const fetchMiscellaenouseReceipt = () => {
    fetchMiscellaenouseReceiptApi(dateFrom, dateTo, sample).then(res => {
      setMiscReceiptData(res)
    })
  }

  useEffect(() => {
    fetchMiscellaenouseReceipt()

    return () => {
      setMiscReceiptData([])
    }
  }, [dateFrom, dateTo, sample])

  return (
    <Flex w='full' flexDirection='column'>
      <Flex border='1px'>
        <PageScrollReusable minHeight='800px' maxHeight='820px'>
          <Table size='sm'>
            <Thead bgColor='secondary'>
              <Tr>
                <Th color='white'>receipty_id</Th>
                <Th color='white'>supplier_code</Th>
                <Th color='white'>supplier_name</Th>
                {
                  buttonChanger ?
                    <>
                      <Th color='white'>details</Th>
                      <Th color='white'>item_code</Th>
                      <Th color='white'>item_description</Th>
                      <Th color='white'>uom</Th>
                      {/* <Th color='white'>category</Th> */}
                      <Th color='white'>quantity</Th>
                    </>
                    :
                    <>
                      <Th color='white'>expiration_date</Th>
                      <Th color='white'>transact_by</Th>
                      <Th color='white'>transaction_date</Th>
                    </>
                }
              </Tr>
            </Thead>
            <Tbody>
              {
                miscReceiptData?.map((item, i) =>
                  <Tr key={i}>
                    <Td>{item.receiptId}</Td>
                    <Td>{item.supplierCode}</Td>
                    <Td>{item.supplierName}</Td>
                    {
                      buttonChanger
                        ?
                        <>
                          <Td>{item.details}</Td>
                          <Td>{item.itemCode}</Td>
                          <Td>{item.itemDescription}</Td>
                          <Td>{item.uom}</Td>
                          {/* <Td>{item.category}</Td> */}
                          <Td>{item.quantity}</Td>
                        </>
                        :
                        <>
                          <Td>{item.expirationDate}</Td>
                          <Td>{item.transactBy}</Td>
                          <Td>{moment(item.transactDate).format('yyyy-MM-DD')}</Td>
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
