import React, { useEffect, useState } from 'react'
import { Flex, Table, Tbody, Td, Th, Thead, Tr, useDisclosure, Button } from '@chakra-ui/react'
import apiClient from '../../../services/apiClient'
import PageScrollReusable from '../../../components/PageScroll-Reusable'

const fetchTransformationHistoryApi = async (dateFrom, dateTo) => {
  const res = await apiClient.get(`Report/TransformationHistoryReport?dateFrom=${dateFrom}&dateTo=${dateTo}`)
  return res.data
}

export const TransformationReportHistory = ({ dateFrom, dateTo, sample }) => {

  const [transformationData, setTransformationData] = useState([])
  const [buttonChanger, setButtonChanger] = useState(true)

  const fetchTransformationHistory = () => {
    fetchTransformationHistoryApi(dateFrom, dateTo, sample).then(res => {
      setTransformationData(res)
    })
  }

  useEffect(() => {
    fetchTransformationHistory()

    return () => {
      setTransformationData([])
    }
  }, [dateFrom, dateTo, sample])

  return (
    <Flex w='full' flexDirection='column'>
      <Flex border='1px'>
        <PageScrollReusable minHeight='800px' maxHeight='820px'>
          <Table size='sm'>
            <Thead bgColor='secondary'>
              <Tr>
                <Th color='white'>transformation_id</Th>
                <Th color='white'>planning_date</Th>
                <Th color='white'>item_code(formula)</Th>
                {
                  buttonChanger ?
                    <>
                      <Th color='white'>description</Th>
                      <Th color='white'>version</Th>
                      <Th color='white'>batch</Th>
                      <Th color='white'>total_quantity</Th>
                    </>
                    :
                    <>
                      <Th color='white'>item_code(recipe)</Th>
                      <Th color='white'>description</Th>
                      <Th color='white'>quantity</Th>
                      <Th color='white'>date_transformed</Th>
                    </>
                }
              </Tr>
            </Thead>
            <Tbody>
              {
                transformationData?.map((item, i) =>
                  <Tr key={i}>
                    <Td>{item.transformationId}</Td>
                    <Td>{item.planningDate}</Td>
                    <Td>{item.itemCode_Formula}</Td>
                    {
                      buttonChanger
                        ?
                        <>
                          <Td>{item.itemDescription_Formula}</Td>
                          <Td>{item.version}</Td>
                          <Td>{item.batch}</Td>
                          <Td>{item.formula_Quantity}</Td>
                        </>
                        :
                        <>
                          <Td>{item.itemCode_Recipe}</Td>
                          <Td>{item.itemDescription_Recipe}</Td>
                          <Td>{item.recipe_Quantity}</Td>
                          <Td>{item.dateTransformed}</Td>
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
