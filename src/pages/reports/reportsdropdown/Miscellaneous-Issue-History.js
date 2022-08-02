import React, { useEffect, useState } from 'react'
import { Flex, Table, Tbody, Td, Th, Thead, Tr, useDisclosure, Button } from '@chakra-ui/react'
import apiClient from '../../../services/apiClient'
import PageScrollReusable from '../../../components/PageScroll-Reusable'

const fetchMiscellaneousIssueHistoryApi = async (dateFrom, dateTo) => {
  const res = await apiClient.get(`Report/MiscellaneousIssueReport?dateFrom=${dateFrom}&dateTo=${dateTo}`)
  return res.data
}

export const MiscellaneousIssueHistory = ({ dateFrom, dateTo, sample }) => {

  const [miscIssueData, setMiscIssueData] = useState([])
  const [buttonChanger, setButtonChanger] = useState(true)

  const fetchMiscellaneousIssueHistory = () => {
    fetchMiscellaneousIssueHistoryApi(dateFrom, dateTo, sample).then(res => {
      setMiscIssueData(res)
    })
  }

  useEffect(() => {
    fetchMiscellaneousIssueHistory()

    return () => {
      setMiscIssueData([])
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
                <Th color='white'>issue_id</Th>
                <Th color='white'>customer_code</Th>
                <Th color='white'>customer_name</Th>
                {
                  buttonChanger ?
                    <>
                      <Th color='white'>details</Th>
                      <Th color='white'>item_code</Th>
                      <Th color='white'>item_description</Th>
                      <Th color='white'>uom</Th>
                      <Th color='white'>category</Th>
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
