import React from 'react'
import { Flex, Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react'
import PageScrollReusable from '../../../components/PageScroll-Reusable'
import moment from 'moment'
import { GrRadialSelected } from 'react-icons/gr'

export const ListofMoveOrder = ({ moveOrderList, setMoveOrderInformation, moveOrderInformation }) => {

  const TableHead = [
    "Line", "Order Id", "Farm", "Farm Code", "Category", "Total Quantity Order", "Order Date", "Date Needed", "Prepared Date"
  ]

  const setterHandler = ({ orderNo, plateNumber, farm, farmCode }) => {
    if (orderNo && plateNumber && farm) {
      setMoveOrderInformation({
        orderNo: orderNo,
        plateNumber: plateNumber,
        farmName: farm,
        farmCode: farmCode
      })
    } else {
      setMoveOrderInformation({
        orderNo: '',
        plateNumber: '',
        farmName: '',
        farmCode: ''
      })
    }
  }

  return (
    <Flex w='full' flexDirection='column'>
      <VStack spacing={0}>
        <Text pb={2} textAlign='center' fontSize='md' color='white' bgColor='secondary' w='full' mb={-1.5}>List of Move Order</Text>
        <PageScrollReusable minHeight='220px' maxHeight='300px'>
          <Table size='sm' variant='simple'>
            <Thead bgColor='secondary'>
              <Tr>
                {
                  TableHead?.map((t, i) =>
                    <Th color='white' key={i}>{t}</Th>
                  )
                }
              </Tr>
            </Thead>
            <Tbody>
              {
                moveOrderList?.map((list, i) =>
                  <Tr key={i}
                    onClick={() => setterHandler(list)}
                    bgColor={moveOrderInformation.orderNo === list.orderNo ? 'table_accent' : 'none'}
                    cursor='pointer'
                  >
                    {
                      moveOrderInformation.orderNo === list.orderNo ?
                        <Td><GrRadialSelected /></Td>
                        :
                        <Td>{i + 1}</Td>
                    }
                    <Td>{list.orderNo}</Td>
                    <Td>{list.farm}</Td>
                    <Td>{list.farmCode}</Td>
                    <Td>{list.category}</Td>
                    <Td>{list.totalOrders}</Td>
                    <Td>{list.orderDate}</Td>
                    <Td>{list.dateNeeded}</Td>
                    <Td>{moment(list.preparedDate).format('MM/DD/yyyy')}</Td>
                  </Tr>
                )
              }
            </Tbody>
          </Table>
        </PageScrollReusable>
      </VStack>
    </Flex>
  )
}
