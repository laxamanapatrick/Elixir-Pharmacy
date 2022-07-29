import React, { useRef, useState } from 'react'
import { Badge, Box, Flex, HStack, Input, Skeleton, Spinner, Stack, Table, Tbody, Td, Text, Th, Thead, toast, Tr, useDisclosure, useToast, VStack } from '@chakra-ui/react'
import { HiRefresh } from 'react-icons/hi'
import PageScrollReusable from '../../../components/PageScroll-Reusable'
import { ErrorModal } from './Error-Modal'
import { ConfirmModal } from './Confirm-Modal'
import DatePicker from 'react-datepicker'


export const ListofOrders = ({ genusOrders, fetchingData, setFromDate, setToDate, fromDate, toDate }) => {

    const [isLoading, setIsLoading] = useState(false)

    const [keyword, setKeyword] = useState('')
    const [errorData, setErrorData] = useState([])

    const { isOpen: isError, onOpen: openError, onClose: closeError } = useDisclosure()
    const { isOpen: isConfirm, onOpen: openConfirm, onClose: closeConfirm } = useDisclosure()

    const resultArray = genusOrders?.genus_orders?.map(item => {
        return {
            transactId: item?.transaction_id,
            customerName: item?.customer?.name,
            customerPosition: item?.customer?.position,
            farmType: item?.order_details?.farm_name,
            farmCode: item?.order_details?.farm_code,
            farmName: item?.order_details?.farm_name,
            orderNo: item?.order_details?.orderNo,
            batchNo: item?.order_details?.batchNo,
            orderDate: item?.order_details?.dateOrdered,
            dateNeeded: item?.order_details?.dateNeeded,
            timeNeeded: item?.order_details?.timeNeeded,
            transactionType: item?.order_details?.type,
            itemCode: item?.order_details?.order?.itemCode,
            itemDescription: item?.order_details?.order?.itemDescription,
            uom: item?.order_details?.order?.uom,
            quantityOrdered: item?.order_details?.order?.quantity,
            category: item?.order_details?.order?.category,
        }
    })

    const dateVar = new Date()
    const startDate = dateVar.setDate(dateVar.getDate() - 3)

    return (
        <Flex w='full' p={5} flexDirection='column'>

            <Flex justifyContent='center'>
                <Badge>Date</Badge>
            </Flex>
            <Flex justifyContent='center'>
                <HStack spacing={2} w='40%'>
                    <Badge>From:</Badge>
                    <DatePicker
                        onChange={(date) => setFromDate(date)}
                        selected={fromDate}
                        minDate={startDate}
                        shouldCloseOnSelect
                        dateFormat="yyyy-MM-dd"
                    />
                    <Badge>To:</Badge>
                    <DatePicker
                        onChange={(date) => setToDate(date)}
                        selected={toDate}
                        minDate={fromDate}
                        shouldCloseOnSelect
                        dateFormat="yyyy-MM-dd"
                    />
                </HStack>
            </Flex>

            {
                fromDate && toDate
                    ?
                    <>
                        <Flex w='full' p={2} justifyContent='space-between'>
                            <HStack>
                                <Text fontSize='sm'>SEARCH:</Text>
                                <Input
                                    placeholder='ex. Farm Name'
                                    onChange={(e) => setKeyword(e.target.value)}
                                    disabled={isLoading}
                                />
                            </HStack>
                            {
                                isLoading ?
                                    <Spinner cursor='pointer' onClick={() => setIsLoading(false)} />
                                    :
                                    <HiRefresh fontSize='25px' cursor='pointer' onClick={() => openConfirm()} />
                            }
                        </Flex>

                        <VStack spacing={0} w='full'>
                            <Text py={2} w='full' fontSize='lg' bgColor='secondary' color='white' textAlign='center'>List of Orders</Text>
                            <PageScrollReusable minHeight='200px' maxHeight='650px'>
                                {
                                    fetchingData ?
                                        <Stack width="full">
                                            <Skeleton height='20px' />
                                            <Skeleton height='20px' />
                                            <Skeleton height='20px' />
                                            <Skeleton height='20px' />
                                            <Skeleton height='20px' />
                                            <Skeleton height='20px' />
                                        </Stack>
                                        :
                                        <Table size='sm'>
                                            <Thead bgColor='secondary'>
                                                <Tr>
                                                    <Th color='white'>Line</Th>
                                                    <Th color='white'>Order Date</Th>
                                                    <Th color='white'>Date Needed</Th>
                                                    <Th color='white'>Farm Code</Th>
                                                    <Th color='white'>Farm Name</Th>
                                                    <Th color='white'>Item Code</Th>
                                                    <Th color='white'>Item Description</Th>
                                                    <Th color='white'>Category</Th>
                                                    <Th color='white'>UOM</Th>
                                                    <Th color='white'>Quantity Order</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {
                                                    genusOrders?.genus_orders
                                                        ?.filter((val) => {
                                                            const newKeyword = new RegExp(`${keyword.toLowerCase()}`)
                                                            return val.order_details.farm_name?.toLowerCase().match(newKeyword, '*')
                                                        }
                                                        )
                                                        ?.map((order, i) =>
                                                            <Tr key={i}>
                                                                <Td>{i + 1}</Td>
                                                                <Td>{order.order_details.dateOrdered}</Td>
                                                                <Td>{order.order_details.dateNeeded}</Td>
                                                                <Td>{order.order_details.farm_code}</Td>
                                                                <Td>{order.order_details.farm_name}</Td>
                                                                <Td>{order.order_details.order.itemCode}</Td>
                                                                <Td>{order.order_details.order.itemDescription}</Td>
                                                                <Td>{order.order_details.order.category}</Td>
                                                                <Td>{order.order_details.order.uom}</Td>
                                                                <Td>{order.order_details.order.quantity}</Td>
                                                            </Tr>
                                                        )
                                                }
                                            </Tbody>
                                        </Table>
                                }
                            </PageScrollReusable>
                        </VStack>
                    </>
                    :
                    ''
            }
            {
                fromDate && toDate ?
                    <Text mt={3} fontSize='xs'>Number of records: {genusOrders?.genus_orders?.length}</Text>
                    : ""
            }
            {
                isError && (
                    <ErrorModal
                        isOpen={isError}
                        onClose={closeError}
                        errorData={errorData}
                        openConfirm={openConfirm}
                        isLoading={isLoading}
                    />
                )
            }
            {
                isConfirm && (
                    <ConfirmModal
                        isOpen={isConfirm}
                        onClose={closeConfirm}
                        resultArray={resultArray}
                        setIsLoading={setIsLoading}
                        setErrorData={setErrorData}
                        openError={openError}
                        isLoading={isLoading}
                    />
                )
            }
        </Flex >
    )
}
