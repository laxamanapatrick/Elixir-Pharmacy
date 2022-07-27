import React, { useEffect, useRef } from 'react'
import { Button, ButtonGroup, Flex, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Select, Spinner, Text, useDisclosure, VStack } from '@chakra-ui/react'
import { useLocation } from 'react-router-dom'
import { AddConfirmation } from './Action-Modals'
import moment from 'moment'

export const RawMaterialsInformation = ({ rawMatsInfo, setRawMatsInfo, listDataTempo, setListDataTempo, details, setDetails,
    customers, rawMats, uoms, setSelectorId
}) => {

    const customerRef = useRef()
    const { isOpen: isModal, onClose: closeModal, onOpen: openModal } = useDisclosure()

    const detailHandler = (data) => {
        if (data) {
            setDetails(data)
        } else {
            setDetails('')
        }
    }

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
                                        onChange={(e) => setRawMatsInfo({
                                            itemCode: rawMatsInfo.itemCode,
                                            itemDescription: rawMatsInfo.itemDescription,
                                            customer: e.target.value,
                                            uom: rawMatsInfo.uom,
                                            expirationDate: rawMatsInfo.expirationDate,
                                            quantity: rawMatsInfo.quantity
                                        })}
                                        ref={customerRef}
                                        w='full' placeholder=' '
                                        bgColor='#fff8dc'
                                    >
                                        {
                                            customers?.map((item, i) =>
                                                <option key={i} value={item.customerName}>{item.customerCode}</option>
                                            )
                                        }
                                    </Select>
                                    : <Spinner />
                            }
                        </HStack>

                    </VStack>

                    <VStack alignItems='start' w='40%' mx={5}>

                        {/* Customer Name */}
                        <HStack w='full'>
                            <Text minW='50%' w='auto' bgColor='secondary' color='white' pl={2} pr={10} py={2.5} fontSize='xs'>Customer Name: </Text>
                            <Text w='full' border='1px' borderColor='gray.200' py={1.5}>{rawMatsInfo.customer ? rawMatsInfo.customer : 'Select a customer'}</Text>
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
                        disabled={!rawMatsInfo.customer || !details}
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
                        listDataTempo={listDataTempo}
                        setListDataTempo={setListDataTempo}
                        details={details}
                        setDetails={setDetails}
                        customerRef={customerRef}
                        rawMats={rawMats}
                        uoms={uoms}
                        setSelectorId={setSelectorId}
                        isOpen={isModal}
                        onClose={closeModal}
                    />
                )
            }

        </Flex >
    )
}


export const RawMatsInfoModal = ({ isOpen, onClose, details, setDetails, rawMatsInfo, setRawMatsInfo,
    listDataTempo, setListDataTempo, customerRef, rawMats, uoms, setSelectorId
}) => {

    const { isOpen: isAdd, onClose: closeAdd, onOpen: openAdd } = useDisclosure()
    const openAddConfirmation = () => {
        openAdd()
    }

    const itemCodeHandler = (data) => {
        if (data) {
            const newData = JSON.parse(data)
            const itemCode = newData.itemCode
            const itemDescription = newData.itemDescription
            setRawMatsInfo({
                itemCode: itemCode,
                itemDescription: itemDescription,
                customer: rawMatsInfo.customer,
                uom: rawMatsInfo.uom,
                expirationDate: rawMatsInfo.expirationDate,
                quantity: rawMatsInfo.quantity
            })
        } else {
            setRawMatsInfo({
                itemCode: '',
                itemDescription: '',
                customer: rawMatsInfo.customer,
                uom: rawMatsInfo.uom,
                expirationDate: rawMatsInfo.expirationDate,
                quantity: rawMatsInfo.quantity
            })
        }
    }

    const newDate = new Date()
    const minDate = moment(newDate).format('yyyy-MM-DD')

    return (
        <>
            <Modal isOpen={isOpen} onClose={() => { }} isCentered size='5xl'>
                <ModalContent>
                    <ModalHeader mb={4}>
                        <Flex justifyContent='center'>
                            Raw Materials Information
                        </Flex>
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
                                    <Input
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
                                    />
                                </HStack>

                                {/* UOM */}
                                < HStack w='full'>
                                    <Text minW='50%' w='auto' bgColor='secondary' color='white' pl={2} pr={7} py={2.5} fontSize='xs'>UOM: </Text>
                                    {
                                        uoms.length > 0 ?
                                            <Select
                                                onChange={(e) => setRawMatsInfo({
                                                    itemCode: rawMatsInfo.itemCode,
                                                    itemDescription: rawMatsInfo.itemDescription,
                                                    customer: rawMatsInfo.customer,
                                                    uom: e.target.value,
                                                    expirationDate: rawMatsInfo.expirationDate,
                                                    quantity: rawMatsInfo.quantity
                                                })}
                                                w='full' placeholder=' '
                                                bgColor='#fff8dc'
                                            >
                                                {
                                                    uoms?.map((item, i) =>
                                                        <option key={i} value={item.uoM_Code}>{item.uoM_Code}</option>
                                                    )
                                                }
                                            </Select>
                                            : <Spinner />
                                    }
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
                                    <Text w='full' border='1px' borderColor='gray.200' py={1.5}>{rawMatsInfo.itemDescription ? rawMatsInfo.itemDescription : 'Select an item code'}</Text>
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
                                    !rawMatsInfo.expirationDate || !rawMatsInfo.quantity || !details
                                }
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
                        details={details} setDetails={setDetails} rawMatsInfo={rawMatsInfo} setRawMatsInfo={setRawMatsInfo}
                        listDataTempo={listDataTempo} setListDataTempo={setListDataTempo}
                        customerRef={customerRef}
                        setSelectorId={setSelectorId}
                    />
                )
            }
        </>
    )
}