import React from 'react'
import {
    Flex, HStack, Select,
    Table, Tbody, Td, Text, Th, Thead, Tr
} from '@chakra-ui/react'
import PageScrollReusable from '../../../components/PageScroll-Reusable'
import moment from 'moment'

export const ListofPreparedDate = ({ orders, orderNo, setOrderNo }) => {

    const orderNoHandler = (id) => {
        if (id) {
            setOrderNo(id)
        } else {
            setOrderNo('')
        }
    }

    return (
        <Flex w='95%' p={10} flexDirection='column'>
            {/* <HStack justifyContent='start' w='13%'>
                <Text fontSize='sm'>STATUS: </Text>
                <Select size='sm'>
                    <option>PENDING</option>
                </Select>
            </HStack> */}

            <Flex flexDirection='column'>
                <Text textAlign='center' bgColor='secondary' color='white'>List of Prepared Date</Text>
                <PageScrollReusable minHeight='200px' maxHeight='210px'>
                    <Table size='sm' variant='simple'>
                        <Thead bgColor='secondary'>
                            <Tr>
                                <Th color='white'>Line</Th>
                                <Th color='white'>Order ID</Th>
                                <Th color='white'>Customer Code</Th>
                                <Th color='white'>Customer Name</Th>
                                <Th color='white'>Category</Th>
                                <Th color='white'>Total Quantity Order</Th>
                                {/* <Th color='white'>Order Date</Th> */}
                                {/* <Th color='white'>Date Needed</Th> */}
                                <Th color='white'>Prepared Date</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                orders?.map((item, i) =>
                                    <Tr
                                        onClick={() => orderNoHandler(item.orderNo)}
                                        bgColor={orderNo === item.orderNo ? 'table_accent' : 'none'}
                                        key={i}
                                        cursor='pointer'
                                    >
                                        <Td>{i + 1}</Td>
                                        <Td>{item.orderNo}</Td>
                                        <Td>{item.farmCode}</Td>
                                        <Td>{item.farm}</Td>
                                        <Td>{item.category}</Td>
                                        <Td>{item.totalOrders}</Td>
                                        {/* <Td>{item.orderDate}</Td> */}
                                        {/* <Td>{item.dateNeeded}</Td> */}
                                        <Td>{moment(item.preparedDate).format("MM/DD/yyyy")}</Td>
                                    </Tr>
                                )
                            }
                        </Tbody>
                    </Table>
                </PageScrollReusable>
            </Flex>
        </Flex>
    )
}
