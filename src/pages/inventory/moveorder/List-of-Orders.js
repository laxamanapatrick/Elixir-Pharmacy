import React, { useState } from 'react'
import { Table, Tbody, Td, Text, Th, Thead, Tr, VStack } from '@chakra-ui/react'
import { MdOutlinePendingActions } from 'react-icons/md'
import { GoArrowSmallRight } from 'react-icons/go'
import { BsCheck2Circle } from 'react-icons/bs'
import PageScrollReusable from '../../../components/PageScroll-Reusable'
import moment from 'moment'

export const ListofOrders = ({ orderListData, setItemCode, highlighterId, setHighlighterId, setQtyOrdered, setPreparedQty, orderId, setWarehouseId }) => {

    const TableHead = [
        "Line",
        "Order Date", "Date Needed",
        "Customer Code", "Customer Name",
        "Category", "Item Code", "Item Description",
        "UOM",
        "Quantity Order", "Prepared Qty",
        "Status"
    ]

    const rowHandler = ({ id, itemCode, quantityOrder, preparedQuantity }) => {
        setWarehouseId('')
        if (id && itemCode) {
            setItemCode(itemCode)
            setHighlighterId(id)
            setQtyOrdered(quantityOrder)
            setPreparedQty(preparedQuantity)
        } else {
            setItemCode('')
            setHighlighterId('')
            setQtyOrdered('')
            setPreparedQty('')
        }
    }

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
                                    <Tr key={i}
                                        onClick={() => rowHandler(list)}
                                        bgColor={highlighterId === list.id ? 'table_accent' : 'none'}
                                        cursor='pointer'
                                    >
                                        {highlighterId === list.id
                                            ?
                                            <Td><GoArrowSmallRight fontSize='27px' /></Td>
                                            :
                                            <Td>{i + 1}</Td>
                                        }
                                        <Td>{moment(list.orderDate).format("yyyy-MM-DD")}</Td>
                                        <Td>{moment(list.dateNeeded).format("yyyy-MM-DD")}</Td>
                                        <Td>{list.farmCode}</Td>
                                        <Td>{list.farm}</Td>
                                        <Td>{list.category}</Td>
                                        <Td>{list.itemCode}</Td>
                                        <Td>{list.itemDescription}</Td>
                                        <Td>{list.uom}</Td>
                                        <Td>{list.quantityOrder}</Td>
                                        <Td>{list.preparedQuantity}</Td>
                                        <Td>
                                            {
                                                list.quantityOrder <= list.preparedQuantity ?
                                                    <BsCheck2Circle fontSize='20px' title='Done' />
                                                    :
                                                    <MdOutlinePendingActions fontSize='20px' title='Pending' />
                                            }
                                        </Td>
                                    </Tr>
                                )
                            }
                        </Tbody>
                    </Table>
            </PageScrollReusable>
        </VStack >

    )
}
