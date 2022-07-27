//Approval Request

import React, { useState, useEffect } from 'react'
import {
  Badge,
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
import apiClient from '../../../services/apiClient'
import PageScrollTransformation from '../../../components/PageScroll-Transformation'

export const ListofRequest = ({ setTransformId, transformId, setStatus, requests }) => {

  // const statusHandler = (data) => {
  //   if (data) {
  //     setStatus(data)
  //   } else {
  //     setStatus("pending")
  //   }
  // }

  const requirementsHandler = (data) => {
    if (data) {
      setTransformId(data)
    } else {
      setTransformId("")
    }
  }

  return (
    <Flex w='90%' flexDirection='column' mt={3}>

      <Flex justifyContent='space-between' mb={3}>
        <HStack>
          <Text>STATUS:</Text>
          <Text border='1px' px={2}>PENDING</Text>
          {/* <Select
            onChange={(e) => statusHandler(e.target.value)}
            bgColor='#ffffe0' fontSize='sm'
          >
            <option value='pending'>PENDING</option>
            <option value='approve'>APPROVE</option>
            <option value='reject'>REJECT</option>
          </Select> */}
        </HStack>
        <HStack>
          {
            transformId &&
            <Badge colorScheme='green'>
              <Text color='secondary'>SELECTED: {transformId ? transformId : ''}</Text>
            </Badge>
          }
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
                <Th color='white'>Total Quantity</Th>
                <Th color='white'>Prod Plan</Th>
                <Th color='white'>Request By</Th>
              </Tr>
            </Thead>
            <Tbody>
              {
                requests?.map((r, i) =>
                  <Tr
                    key={i} onClick={() => requirementsHandler(r.id)}
                    bgColor={transformId === r.id ? 'table_accent' : 'none'}
                    cursor='pointer'
                  >
                    <Td>{i + 1}</Td>
                    <Td>{r.id}</Td>
                    <Td>{r.itemCode}</Td>
                    <Td>{r.itemDescription}</Td>
                    <Td>{r.uom}</Td>
                    <Td>{r.batch}</Td>
                    <Td>{r.version}</Td>
                    <Td>{(r.quantity * r.batch).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
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
        <Text fontSize='xs'>Number of entries {requests?.length}</Text>
      </Flex>
    </Flex>
  )
}
