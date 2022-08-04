import React, { useState } from 'react'
import { Flex, HStack, Input, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import PageScrollReusable from '../../../components/PageScroll-Reusable'
import DatePicker from 'react-datepicker'

export const ListofOrders = ({ setDateFrom, setDateTo, dateFrom, dateTo, orderSummary, orderId, setOrderId, setItemCode, setOrderDate }) => {

    const TableHead = [
        "Line", "Order Date", "Item Code",
        "Item Description", "UOM", "Quantity Order", "Stock on Hand", "Difference"
    ]

    const orderHandler = ({ id, itemCode, orderDate }) => {
        if (id && itemCode && orderDate) {
            setOrderId(id)
            setItemCode(itemCode)
            setOrderDate(orderDate)
        } else {
            setOrderId('')
            setItemCode('')
            setOrderDate('')
        }
    }

    return (
        <Flex width='full' p={5} flexDirection='column'>

            <HStack spacing={2} w='40%' justifyContent='start'>
                <Text fontSize='sm'>From:</Text>
                <Input
                    onChange={(e) => setDateFrom(e.target.value)}
                    value={dateFrom}
                    w='full' type='date' bgColor='#fff8dc'
                />
                <Text fontSize='sm'>To:</Text>
                <Input
                    onChange={(e) => setDateTo(e.target.value)}
                    value={dateTo}
                    w='full' type='date' bgColor='#fff8dc'
                />
            </HStack>

            <Flex flexDirection='column' mt={3}>
                <Text textAlign='center' color='white' bgColor='secondary'>List of Orders</Text>
                <PageScrollReusable minHeight='220px' maxHeight='280px'>
                    <Table size='sm'>
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
                                orderSummary?.map((order, i) =>
                                    <Tr
                                        onClick={() => orderHandler(order)}
                                        key={i} cursor='pointer'
                                        bgColor={
                                            orderId === order.id ? 'table_accent' : 'none'
                                                && order.quantityOrder > order.stockOnHand ? 'pink' : 'none'
                                        }
                                    >
                                        <Td>{i + 1}</Td>
                                        <Td>{order.orderDate}</Td>
                                        <Td>{order.itemCode}</Td>
                                        <Td>{order.itemDescription}</Td>
                                        <Td>{order.uom}</Td>
                                        <Td>{order.quantityOrder}</Td>
                                        <Td>{order.stockOnHand}</Td>
                                        <Td>{order.difference}</Td>
                                    </Tr>
                                )
                            }
                        </Tbody>
                    </Table>
                </PageScrollReusable>
                <Text mt={4} fontSize='xs'>Number of records: {orderSummary?.length}</Text>
            </Flex>

        </Flex>
    )
}
