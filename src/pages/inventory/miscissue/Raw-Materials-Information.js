import React, { useEffect, useRef, useState } from 'react'
import { Button, ButtonGroup, Flex, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Select, Spinner, Text, useDisclosure, VStack } from '@chakra-ui/react'
import { AddConfirmation } from './Action-Modal'
import moment from 'moment'
import apiClient from '../../../services/apiClient'

export const RawMaterialsInformation = ({ rawMatsInfo, setRawMatsInfo, details, setDetails, customerRef,
    customers, rawMats, uoms, expiryDates, setSelectorId, setCustomerData, setWarehouseId, warehouseId, fetchActiveMiscIssues, customerData, remarks, setRemarks, remarksRef,
    transactionDate, setTransactionDate
}) => {

    const { isOpen: isModal, onClose: closeModal, onOpen: openModal } = useDisclosure()

    const [transactions, setTransactions] = useState([])
    const fetchTransactionTypeApi = async () => {
        const res = await apiClient.get(`Transaction/GetAllActiveTransactionName`)
        return res.data
    }
    const fetchTransactionType = () => {
        fetchTransactionTypeApi().then(res => {
            setTransactions(res)
        })
    }
    useEffect(() => {
        fetchTransactionType()
    }, [])

    const detailHandler = (data) => {
        if (data) {
            setDetails(data)
        } else {
            setDetails('')
        }
    }

    const customerHandler = (data) => {
        if (data) {
            const newData = JSON.parse(data)
            const customerCode = newData.customerCode
            const customer = newData.customerName
            setRawMatsInfo({
                itemCode: rawMatsInfo.itemCode,
                itemDescription: rawMatsInfo.itemDescription,
                customer: customer,
                uom: rawMatsInfo.uom,
                expirationDate: rawMatsInfo.expirationDate,
                quantity: rawMatsInfo.quantity
            })
            setCustomerData({
                customerCode: customerCode,
                customer: customer
            })
        } else {
            setRawMatsInfo({
                itemCode: rawMatsInfo.itemCode,
                itemDescription: rawMatsInfo.itemDescription,
                customer: '',
                uom: rawMatsInfo.uom,
                expirationDate: rawMatsInfo.expirationDate,
                quantity: rawMatsInfo.quantity
            })
            setCustomerData({
                customerCode: '',
                customer: ''
            })
        }
    }

    const newDate = new Date();
    const maxTransactionDate = moment(newDate).format("yyyy-MM-DD");
    const minTransactionDate = moment(newDate.setDate(newDate.getDate() - 7)).format("yyyy-MM-DD")

    return (
        <Flex justifyContent='center' flexDirection='column' w='full'>
            <VStack w='full' spacing={6}>
                <Text bgColor='secondary' w='full' color='white' textAlign='center' fontWeight='semibold'>Raw Materials Information</Text>
                <Flex w='95%' justifyContent='space-between'>

                    <VStack alignItems='start' w='40%' mx={5}>

                        {/* Customer Code */}
                        <HStack w='full'>
                            <Text minW='50%' w='auto' bgColor='secondary' color='white' pl={2} py={2.5} fontSize='xs'>Customer: </Text>
                            {
                                customers.length > 0 ?
                                    <Select
                                        onChange={(e) => customerHandler(e.target.value)}
                                        ref={customerRef}
                                        w='full' placeholder=' '
                                        bgColor='#fff8dc'
                                    >
                                        {
                                            customers?.map((item, i) =>
                                                <option key={i} value={JSON.stringify(item)}>{`${item.customerCode} - ${item.customerName}`}</option>
                                            )
                                        }
                                    </Select>
                                    : <Spinner />
                            }
                        </HStack>

                        {/* Remarks */}
                        <HStack w='full'>
                            <Text minW='50%' w='auto' bgColor='secondary' color='white' pl={2} py={2.5} fontSize='xs'>Transaction Type: </Text>

                            {
                                transactions.length > 0 ? (<Select
                                    onChange={(e) => setRemarks(e.target.value)}
                                    placeholder=' ' bgColor='#fff8dc'>
                                    {transactions?.map(tt => (
                                        <option key={tt.id} value={tt.transactionName}>{tt.transactionName}</option>
                                    ))}

                                </Select>) : "loading"
                            }

                        </HStack>

                    </VStack>

                    <VStack alignItems='start' w='40%' mx={5}>

                        {/* Customer Name */}
                        <HStack w='full'>
                            <Text minW='50%' w='auto' bgColor='secondary' color='white' pl={2} pr={10} py={2.5} fontSize='xs'>Customer Name: </Text>
                            <Text w='full' border='1px' borderColor='gray.200' py={1.5}>{rawMatsInfo.customer ? rawMatsInfo.customer : 'Select a customer'}</Text>
                        </HStack>

                        {/* Transaction Date */}
                        <HStack w="full">
                            <Text minW="50%" w="auto"bgColor="secondary" color="white" pl={2} pr={10} py={2.5} fontSize="xs">Transaction Date: </Text>
                            <Input
                                onChange={(e) => setTransactionDate(e.target.value)}
                                min={minTransactionDate}
                                max={maxTransactionDate}
                                type="date"
                                bgColor="#fff8dc"
                            />
                            </HStack>

                    </VStack>

                </Flex>
                <VStack alignItems='start' w='92%' mx={5}>
                    {/* Details */}
                    <HStack w='full'>
                        <Text w='auto' bgColor='secondary' color='white' pl={2} pr={5} py={2.5} fontSize='xs'>Details: </Text>
                        <Input
                            onChange={(e) => detailHandler(e.target.value)}
                            value={details}
                            minW='93%' w='auto'
                            bgColor='#fff8dc'
                        />
                    </HStack>
                </VStack>
                <Flex w='full' justifyContent='end' mt={4}>
                    <Button
                        onClick={() => openModal()}
                        disabled={!rawMatsInfo.customer || !details || !remarks || !transactionDate}
                        size='xs' colorScheme='blue'
                    >
                        New
                    </Button>
                </Flex>
            </VStack >

            {
                isModal && (
                    <RawMatsInfoModal
                        rawMatsInfo={rawMatsInfo}
                        setRawMatsInfo={setRawMatsInfo}
                        details={details}
                        setDetails={setDetails}
                        customerRef={customerRef}
                        rawMats={rawMats}
                        uoms={uoms}
                        expiryDates={expiryDates}
                        setSelectorId={setSelectorId}
                        setCustomerData={setCustomerData}
                        warehouseId={warehouseId}
                        setWarehouseId={setWarehouseId}
                        fetchActiveMiscIssues={fetchActiveMiscIssues}
                        customerData={customerData}
                        isOpen={isModal}
                        onClose={closeModal}
                        remarks={remarks} setRemarks={setRemarks}
                    />
                )
            }

        </Flex >
    )
}


export const RawMatsInfoModal = ({ isOpen, onClose, details, setDetails, rawMatsInfo, setRawMatsInfo,
    customerRef, rawMats, expiryDates, setSelectorId, setCustomerData, setWarehouseId, warehouseId,
    fetchActiveMiscIssues, customerData, remarks, setRemarks
}) => {

    const [availableStock, setAvailableStock] = useState('')

    const { isOpen: isAdd, onClose: closeAdd, onOpen: openAdd } = useDisclosure()
    const openAddConfirmation = () => {
        openAdd()
    }

    const itemCodeHandler = (data) => {
        if (data) {
            const newData = JSON.parse(data)
            const itemCode = newData.itemCode
            const itemDescription = newData.itemDescription
            const uom = newData.uom
            // const expirationDate = newData.expirationDate
            setRawMatsInfo({
                itemCode: itemCode,
                itemDescription: itemDescription,
                customer: rawMatsInfo.customer,
                uom: uom,
                // expirationDate: expirationDate
                expirationDate: rawMatsInfo.expirationDate,
                quantity: rawMatsInfo.quantity
            })
        } else {
            setRawMatsInfo({
                itemCode: '',
                itemDescription: '',
                customer: rawMatsInfo.customer,
                uom: '',
                // expirationDate: ''
                expirationDate: rawMatsInfo.expirationDate,
                quantity: rawMatsInfo.quantity
            })
        }
    }

    const expiryDateHandler = (data) => {
        if (data) {
            const newData = JSON.parse(data)
            const warehouseId = newData.warehouseId
            const expirationDate = newData.expirationDate
            setAvailableStock(newData.remainingStocks)
            setWarehouseId(warehouseId)
            setRawMatsInfo({
                itemCode: rawMatsInfo.itemCode,
                itemDescription: rawMatsInfo.itemDescription,
                customer: rawMatsInfo.customer,
                uom: rawMatsInfo.uom,
                expirationDate: expirationDate,
                quantity: rawMatsInfo.quantity
            })
        } else {
            setAvailableStock('')
            setWarehouseId('')
            setRawMatsInfo({
                itemCode: rawMatsInfo.itemCode,
                itemDescription: rawMatsInfo.itemDescription,
                customer: rawMatsInfo.customer,
                uom: rawMatsInfo.uom,
                expirationDate: '',
                quantity: rawMatsInfo.quantity
            })
        }
    }

    useEffect(() => {
        setAvailableStock('')

    }, [rawMatsInfo.itemCode])

    const newDate = new Date()
    const minDate = moment(newDate).format('yyyy-MM-DD')

    return (
        <>
            <Modal isOpen={isOpen} onClose={() => { }} isCentered size='5xl'>
                <ModalContent>
                    <ModalHeader mb={4}>
                        <VStack justifyContent='center' spacing={-2}>
                            <Text>Raw Materials Information</Text>
                            <Text fontSize='xs'>Miscellaneous Issue</Text>
                        </VStack>
                    </ModalHeader>
                    <ModalCloseButton onClick={onClose} />
                    <ModalBody mb={5}>
                        <Flex w='95%' justifyContent='space-between'>
                            <VStack alignItems='start' w='40%' mx={5}>
                                {/* Item Code */}
                                <HStack w='full'>
                                    <Text minW='50%' w='auto' bgColor='secondary' color='white' pl={2} pr={7} py={2.5} fontSize='xs'>Item Code: </Text>\
                                    {
                                        rawMats.length > 0 ?
                                            <Select
                                                onChange={(e) => itemCodeHandler(e.target.value)}
                                                w='full' placeholder=' '
                                                bgColor='#fff8dc'
                                            >
                                                {
                                                    rawMats?.map((item, i) =>
                                                        <option key={i} value={JSON.stringify(item)}>{item.itemCode}</option>
                                                    )
                                                }
                                            </Select>
                                            : <Spinner />
                                    }
                                </HStack>


                                {/* Expiration Date */}
                                <HStack w='full'>
                                    <Text minW='50%' w='auto' bgColor='secondary' color='white' pl={2} pr={7} py={2.5} fontSize='xs'>Expiration Date: </Text>
                                    {
                                        expiryDates.length > 0 ?
                                            <Select
                                                onChange={(e) => expiryDateHandler(e.target.value)}
                                                w='full' placeholder=' '
                                                bgColor='#fff8dc'
                                            >
                                                {
                                                    expiryDates?.map((item, i) =>
                                                        <option key={i} value={JSON.stringify(item)}>{item.expirationDate}</option>
                                                    )
                                                }
                                            </Select>
                                            : <Text color='danger' fontStyle='italic'>No Available Stocks</Text>
                                    }
                                    {/* <Input
                                        onChange={(e) => setRawMatsInfo({
                                            itemCode: rawMatsInfo.itemCode,
                                            itemDescription: rawMatsInfo.itemDescription,
                                            customer: rawMatsInfo.customer,
                                            uom: rawMatsInfo.uom,
                                            expirationDate: e.target.value,
                                            quantity: rawMatsInfo.quantity
                                        })}
                                        min={minDate}
                                        w='full' type='date'
                                        bgColor='#fff8dc'
                                    /> */}
                                    {/* <Text textAlign='center' w='full' bgColor='gray.200' border='1px' borderColor='gray.200' py={1.5}>{rawMatsInfo.expirationDate ? rawMatsInfo.expirationDate : 'Select an item code'}</Text> */}
                                </HStack>

                                {/* Quantity */}
                                <HStack w='full'>
                                    <Text minW='50%' w='auto' bgColor='secondary' color='white' pl={2} pr={7} py={2.5} fontSize='xs'>Quantity: </Text>
                                    <Input
                                        onChange={(e) => setRawMatsInfo({
                                            itemCode: rawMatsInfo.itemCode,
                                            itemDescription: rawMatsInfo.itemDescription,
                                            customer: rawMatsInfo.customer,
                                            uom: rawMatsInfo.uom,
                                            expirationDate: rawMatsInfo.expirationDate,
                                            quantity: Number(e.target.value)
                                        })}
                                        type="number"
                                        onWheel={(e) => e.target.blur()}
                                        onKeyDown={(e) => ["E", "e", "+", "-"].includes(e.key) && e.preventDefault()}
                                        onPaste={(e) => e.preventDefault()}
                                        w='full'
                                        bgColor='#fff8dc'
                                    />
                                </HStack>
                            </VStack>

                            <VStack alignItems='start' w='40%' mx={5}>
                                {/* Item Description */}
                                <HStack w='full'>
                                    <Text minW='50%' w='auto' bgColor='secondary' color='white' pl={2} pr={10} py={2.5} fontSize='xs'>Item Description: </Text>
                                    <Text textAlign='center' w='full' bgColor='gray.200' border='1px' borderColor='gray.200' py={1.5}>{rawMatsInfo.itemDescription ? rawMatsInfo.itemDescription : 'Select an item code'}</Text>
                                </HStack>

                                {/* UOM */}
                                < HStack w='full'>
                                    <Text minW='50%' w='auto' bgColor='secondary' color='white' pl={2} pr={7} py={2.5} fontSize='xs'>UOM: </Text>
                                    <Text textAlign='center' w='full' bgColor='gray.200' border='1px' borderColor='gray.200' py={1.5}>{rawMatsInfo.uom ? rawMatsInfo.uom : 'Select an item code'}</Text>
                                </HStack>

                                {/* Available Stocks */}
                                < HStack w='full'>
                                    <Text minW='50%' w='auto' bgColor='secondary' color='white' pl={2} pr={7} py={2.5} fontSize='xs'>Available Stock: </Text>
                                    {expiryDates.length === 0
                                        ?
                                        <Text textAlign='center' w='full' bgColor='gray.200' border='1px' borderColor='gray.200' py={1.5}>No Available Stock</Text>
                                        :
                                        <Text textAlign='center' w='full' bgColor='gray.200' border='1px' borderColor='gray.200' py={1.5}>{availableStock ? availableStock : 'Select an expiration date'}</Text>
                                    }
                                </HStack>
                            </VStack>
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <ButtonGroup size='xs'>
                            <Button
                                onClick={openAddConfirmation}
                                disabled={
                                    !rawMatsInfo.itemCode || !rawMatsInfo.customer || !rawMatsInfo.uom ||
                                    !rawMatsInfo.expirationDate || !rawMatsInfo.quantity || !details || rawMatsInfo.quantity > availableStock
                                }
                                title={rawMatsInfo.quantity > availableStock ? 'Quantity must not be greater than available stock' : ''}
                                colorScheme='blue' px={4}
                            >
                                Add
                            </Button>
                            <Button colorScheme='red' onClick={onClose}>Cancel</Button>
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            {
                isAdd && (
                    <AddConfirmation
                        isOpen={isAdd}
                        onClose={closeAdd}
                        closeAddModal={onClose}
                        details={details} setDetails={setDetails}
                        rawMatsInfo={rawMatsInfo} setRawMatsInfo={setRawMatsInfo}
                        customerRef={customerRef}
                        setSelectorId={setSelectorId}
                        warehouseId={warehouseId} setWarehouseId={setWarehouseId}
                        fetchActiveMiscIssues={fetchActiveMiscIssues}
                        customerData={customerData}
                        remarks={remarks} setRemarks={setRemarks}
                    />
                )
            }
        </>
    )
}