import React, { useEffect, useState } from 'react'
import { Flex, Table, Tbody, Td, Th, Thead, Tr, useDisclosure, Button } from '@chakra-ui/react'
import apiClient from '../../../services/apiClient'
import PageScrollReusable from '../../../components/PageScroll-Reusable'
import moment from 'moment'

const fetchCancelledOrdersApi = async (dateFrom, dateTo) => {
    const res = await apiClient.get(`Report/CancelledOrderReport?dateFrom=${dateFrom}&dateTo=${dateTo}`)
    return res.data
}

export const CancelledOrders = ({ dateFrom, dateTo, sample }) => {

    const [buttonChanger, setButtonChanger] = useState(true)

    const [cancelledData, setCancelledData] = useState([])

    const fetchCancelledOrders = () => {
        fetchCancelledOrdersApi(dateFrom, dateTo).then(res => {
            setCancelledData(res)
        })
    }

    useEffect(() => {
        fetchCancelledOrders()

        return () => {
            setCancelledData([])
        }
    }, [dateFrom, dateTo])

    return (
        <Flex w='full' flexDirection='column'>
            <Flex border='1px'>
                <PageScrollReusable minHeight='800px' maxHeight='820px'>
                    <Table size='sm'>
                        <Thead bgColor='secondary'>
                            <Tr>
                                <Th color='white'>Order ID</Th>
                                <Th color='white'>Date Ordered</Th>
                                <Th color='white'>Date Needed</Th>
                                <Th color='white'>Customer Code</Th>
                                <Th color='white'>Customer Name</Th>
                                <Th color='white'>Item Code</Th>
                                <Th color='white'>Item Description</Th>
                                <Th color='white'>Quantity Ordered</Th>
                                <Th color='white'>Cancelled Date</Th>
                                <Th color='white'>Cancelled By</Th>
                                <Th color='white'>Reason</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                cancelledData?.map((item, i) =>
                                    <Tr key={i}>
                                        <Td>{item.orderId}</Td>
                                        <Td>{item.dateOrdered}</Td>
                                        <Td>{item.dateNeeded}</Td>
                                        <Td>{item.customerCode}</Td>
                                        <Td>{item.customerName}</Td>
                                        <Td>{item.itemCode}</Td>
                                        <Td>{item.itemDescription}</Td>
                                        <Td>{item.quantityOrdered}</Td>
                                        <Td>{moment(item.cancelledDate).format('yyyy-MM-DD')}</Td>
                                        <Td>{item.cancelledBy}</Td>
                                        <Td>{item.reason}</Td>
                                    </Tr>
                                )
                            }
                        </Tbody>
                    </Table>
                </PageScrollReusable>
            </Flex>

            {/* <Flex justifyContent='end' mt={2}>
                <Button size='xs' colorScheme='teal' onClick={() => setButtonChanger(!buttonChanger)}>
                    {buttonChanger ? `>>>>` : `<<<<`}
                </Button>
            </Flex> */}
        </Flex>
    )
}
