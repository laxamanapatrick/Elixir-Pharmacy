//Status of Request

import React, { useState, useEffect } from 'react'
import {
  Flex,
  Heading,
  HStack,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack
} from '@chakra-ui/react'
import PageScrollTransformation from '../../../../components/PageScroll-Transformation'
import apiClient from '../../../../services/apiClient'

const fetchRequestByStatusApi = async (status) => {
  const res = await apiClient.get(`Planning/GetAllPendingRequest?status=${status}`)
  return res.data
}

export const ListofRequest = ({ setTransformId, transformId }) => {

  const [status, setStatus] = useState("pending")
  const [requests, setRequests] = useState([])

  const fetchRequestByStatus = () => {
    fetchRequestByStatusApi(status).then(res => {
      setRequests(res)
    })
  }

  useEffect(() => {
    fetchRequestByStatus()
  }, [status])

  const statusHandler = (data) => {
    if (data) {
      setTransformId("")
      setStatus(data)
    } else {
      setStatus("")
    }
  }

  const requirementsHandler = (data) => {
    setTransformId(data)
  }

  return (
    <Flex w='90%' flexDirection='column' mt={3}>
      <Flex justifyContent='start' mb={3}>
        <HStack>
          <Text>STATUS:</Text>
          <Select bgColor='#ffffe0' fontSize='sm' onChange={(e) => statusHandler(e.target.value)}>
            <option value='pending'>PENDING</option>
            <option value='approved'>APPROVED</option>
            <option value='rejected'>REJECTED</option>
            <option value='cancelled'>CANCELLED</option>
          </Select>
        </HStack>
      </Flex>
      <Flex justifyContent='center' bgColor='secondary' p={1}>
        <Heading color='white' fontSize='l' fontWeight='semibold'>List of Request</Heading>
      </Flex>
      <Flex>
        <PageScrollTransformation minHeight='100px' maxHeight='270px'>
          <Table variant='simple' size='sm'>
            <Thead bgColor='secondary'>
              <Tr>
                <Th color='white'>Line</Th>
                <Th color='white'>Transform Id</Th>
                <Th color='white'>Item Code</Th>
                <Th color='white'>Item Description</Th>
                <Th color='white'>UOM</Th>
                <Th color='white'>Batch</Th>
                <Th color='white'>Version</Th>
                <Th color='white'>Quantity</Th>
                <Th color='white'>Prod Plan</Th>
                <Th color='white'>Request By</Th>
              </Tr>
            </Thead>
            <Tbody>
              {
                requests?.map((r, i) =>
                  <Tr
                    key={i} onClick={() => requirementsHandler(r.id)}
                    bgColor={r.id === transformId ? 'table_accent' : 'none'}
                    cursor='pointer'
                  >
                    <Td>{i+1}</Td>
                    <Td>{r.id}</Td>
                    <Td>{r.itemCode}</Td>
                    <Td>{r.itemDescription}</Td>
                    <Td>{r.uom}</Td>
                    <Td>{r.batch}</Td>
                    <Td>{r.version}</Td>
                    <Td>{r.quantity}</Td>
                    <Td>{r.prodPlan}</Td>
                    <Td>{r.addedBy}</Td>
                  </Tr>
                )
              }
            </Tbody>
          </Table>
        </PageScrollTransformation>
      </Flex>
      <Flex justifyContent='start' mt={1}>
      <Text fontSize='xs'>Number of entries: {requests?.length}</Text>
      </Flex>
    </Flex>
  )
}
