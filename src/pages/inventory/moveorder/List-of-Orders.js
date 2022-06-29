import React from 'react'
import { Badge, Button, Checkbox, Flex, FormLabel, HStack, Input, Select, Table, Tbody, Td, Text, Th, Thead, Tr, useDisclosure, VStack } from '@chakra-ui/react'
import { MdOutlinePending } from 'react-icons/md'
import PageScrollReusable from '../../../components/PageScroll-Reusable'
import moment from 'moment'

export const ListofOrders = ({ orderListData }) => {

    const TableHead = [
        "Line",
        "Order Date", "Date Needed",
        "Farm", "Farm Code",
        "Category", "Item Code", "Item Description",
        "UOM",
        "Quantity Order", "Prepared Qty",
        "Status"
    ]

    return (

        <VStack w='full' spacing={0} justifyContent='center' mt={10}>
            <Text w='full' fontWeight='semibold' fontSize='md' bgColor='secondary' color='white' textAlign='center'>List of Orders</Text>
            <PageScrollReusable minHeight='150px' maxHeight='200px'>
                <Table size='sm' variant='simple'>
                    <Thead bgColor='secondary'>
                        <Tr>{TableHead?.map((head, i) => <Th key={i} color='white'>{head}</Th>)}</Tr>
                    </Thead>
                    <Tbody>
                        {
                            orderListData?.map((list, i) =>
                                <Tr key={i}>
                                    <Td>{i + 1}</Td>
                                    <Td>{moment(list.orderDate).format("yyyy-MM-DD")}</Td>
                                    <Td>{moment(list.dateNeeded).format("yyyy-MM-DD")}</Td>
                                    <Td>{list.farm}</Td>
                                    <Td>{list.farmCode}</Td>
                                    <Td>{list.category}</Td>
                                    <Td>{list.itemCode}</Td>
                                    <Td>{list.itemDescription}</Td>
                                    <Td>{list.uom}</Td>
                                    <Td>{list.quantityOrder}</Td>
                                    <Td>{list.preparedQuantity}</Td>
                                    <Td>
                                        <MdOutlinePending fontSize='20px' title='pending' />
                                    </Td>
                                </Tr>
                            )
                        }
                    </Tbody>
                </Table>
            </PageScrollReusable>
        </VStack>

    )
}
