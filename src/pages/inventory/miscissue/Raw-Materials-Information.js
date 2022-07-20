import React from 'react'
import { Button, ButtonGroup, Flex, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Select, Text, useDisclosure, VStack } from '@chakra-ui/react'

export const RawMaterialsInformation = ({ rawMatsInfo, setRawMatsInfo, setListDataTempo, details, setDetails }) => {

    const { isOpen: isModal, onClose: closeModal, onOpen: openModal } = useDisclosure()

    return (
        <Flex justifyContent='center' flexDirection='column' w='full'>
            <VStack w='full' spacing={6}>
                <Text bgColor='secondary' w='full' color='white' textAlign='center' fontWeight='semibold'>Raw Materials Information</Text>
                <Flex w='95%' justifyContent='space-between'>

                    <VStack alignItems='start' w='40%' mx={5}>

                        {/* Customer Code */}
                        <HStack w='full'>
                            <Text minW='50%' w='auto' bgColor='secondary' color='white' pl={2} py={2.5} fontSize='xs'>Customer: </Text>
                            <Select
                                onChange={(e) => setRawMatsInfo({
                                    itemCode: rawMatsInfo.itemCode,
                                    supplier: e.target.value,
                                    uom: rawMatsInfo.uom,
                                    expirationDate: rawMatsInfo.expirationDate,
                                    quantity: rawMatsInfo.quantity
                                })}
                                w='full' placeholder=' '
                            >
                                <option>Sample 1</option>
                                <option>Sample 2</option>
                            </Select>
                        </HStack>

                    </VStack>

                    <VStack alignItems='start' w='40%' mx={5}>

                        {/* Customer Name */}
                        <HStack w='full'>
                            <Text minW='50%' w='auto' bgColor='secondary' color='white' pl={2} pr={10} py={2.5} fontSize='xs'>Customer Name: </Text>
                            <Input w='95%' readOnly />
                        </HStack>

                    </VStack>

                </Flex>
                <VStack alignItems='start' w='92%' mx={5}>
                    {/* Details */}
                    <HStack w='full'>
                        <Text w='auto' bgColor='secondary' color='white' pl={2} pr={5} py={2.5} fontSize='xs'>Details: </Text>
                        <Input
                            onChange={(e) => setDetails(e.target.value)}
                            minW='93%' w='auto'
                        />
                    </HStack>
                </VStack>
                <Flex w='full' justifyContent='end' mt={4}>
                    <Button
                        onClick={() => openModal()}
                        disabled={!rawMatsInfo.supplier}
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
                        setListDataTempo={setListDataTempo}
                        details={details}
                        setDetails={setDetails}
                        isOpen={isModal}
                        onClose={closeModal}
                    />
                )
            }

        </Flex >
    )
}


export const RawMatsInfoModal = ({ isOpen, onClose, details, setDetails, rawMatsInfo, setRawMatsInfo, setListDataTempo }) => {

    const submitHandler = () => {
        setListDataTempo({
            itemCode: rawMatsInfo.itemCode,
            supplier: rawMatsInfo.supplier,
            uom: rawMatsInfo.uom,
            expirationDate: rawMatsInfo.expirationDate,
            quantity: rawMatsInfo.quantity,
            description: details
        })
        // setRawMatsInfo({
        //     itemCode: '',
        //     supplier: '',
        //     uom: '',
        //     expirationDate: '',
        //     quantity: ''
        // })
        // setDetails('')
    }

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
                                    <Select
                                        onChange={(e) => setRawMatsInfo({
                                            itemCode: e.target.value,
                                            supplier: rawMatsInfo.supplier,
                                            uom: rawMatsInfo.uom,
                                            expirationDate: rawMatsInfo.expirationDate,
                                            quantity: rawMatsInfo.quantity
                                        })}
                                        w='full' placeholder=' '
                                    >
                                        <option>Sample 1</option>
                                        <option>Sample 2</option>
                                    </Select>
                                </HStack>


                                {/* Expiration Date */}
                                <HStack w='full'>
                                    <Text minW='50%' w='auto' bgColor='secondary' color='white' pl={2} pr={7} py={2.5} fontSize='xs'>Expiration Date: </Text>
                                    <Input
                                        onChange={(e) => setRawMatsInfo({
                                            itemCode: rawMatsInfo.itemCode,
                                            supplier: rawMatsInfo.supplier,
                                            uom: rawMatsInfo.uom,
                                            expirationDate: e.target.value,
                                            quantity: rawMatsInfo.quantity
                                        })}
                                        w='full' type='date'
                                    />
                                </HStack>

                                {/* UOM */}
                                < HStack w='full'>
                                    <Text minW='50%' w='auto' bgColor='secondary' color='white' pl={2} pr={7} py={2.5} fontSize='xs'>UOM: </Text>
                                    <Select
                                        onChange={(e) => setRawMatsInfo({
                                            itemCode: rawMatsInfo.itemCode,
                                            supplier: rawMatsInfo.supplier,
                                            uom: e.target.value,
                                            expirationDate: rawMatsInfo.expirationDate,
                                            quantity: rawMatsInfo.quantity
                                        })}
                                        w='full' placeholder=' '
                                    >
                                        <option>Sample 1</option>
                                        <option>Sample 2</option>
                                    </Select>
                                </HStack>

                                {/* Quantity */}
                                <HStack w='full'>
                                    <Text minW='50%' w='auto' bgColor='secondary' color='white' pl={2} pr={7} py={2.5} fontSize='xs'>Quantity: </Text>
                                    <Input
                                        onChange={(e) => setRawMatsInfo({
                                            itemCode: rawMatsInfo.itemCode,
                                            supplier: rawMatsInfo.supplier,
                                            uom: rawMatsInfo.uom,
                                            expirationDate: rawMatsInfo.expirationDate,
                                            quantity: Number(e.target.value)
                                        })}
                                        w='full' type='number'
                                    />
                                </HStack>

                            </VStack>
                            <VStack alignItems='start' w='40%' mx={5}>
                                {/* Item Description */}
                                <HStack w='full'>
                                    <Text minW='50%' w='auto' bgColor='secondary' color='white' pl={2} pr={10} py={2.5} fontSize='xs'>Item Description: </Text>
                                    <Input w='95%' readOnly />
                                </HStack>

                            </VStack>
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <ButtonGroup size='xs'>
                            <Button colorScheme='blue' px={4} onClick={submitHandler}>Add</Button>
                            <Button colorScheme='red' onClick={onClose}>Cancel</Button>
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}