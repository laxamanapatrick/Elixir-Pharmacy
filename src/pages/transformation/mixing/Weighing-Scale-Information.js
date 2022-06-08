import React, { useState, useEffect, useRef } from 'react'
import { Box, Button, ButtonGroup, Flex, HStack, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Select, Text, useDisclosure, useToast, VStack } from '@chakra-ui/react'
import { FaCloudscale } from 'react-icons/fa'
import { ToastComponent } from '../../../components/Toast'
import apiClient from '../../../services/apiClient'
import moment from 'moment'
import { useReactToPrint } from 'react-to-print'
import Barcode from 'react-barcode';
import { PrintList } from './Print-List'

export const WeighingScaleInformation = ({ transformId, batchRemaining, fetchMixingRequest, fetchRequirements,
    fetchBatchRemaining, setMixingCue, quantity, requests, batch }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const [totalWeight, setTotalWeight] = useState('')
    const [disableSave, setDisableSave] = useState(true)

    const valueRef = useRef(null)

    useEffect(() => {
        if (totalWeight === '') {
            window.setTimeout(() => {
                valueRef?.current?.focus()
            }, 1000)
        }
    }, [totalWeight])

    const quantityPerBatch = Number(quantity) / Number(batch)
    const weightHandler = (data) => {
        setTotalWeight(data)
        const minAllowable = Number(quantityPerBatch) * 0.95
        const maxAllowable = Number(quantityPerBatch) * 1.05
        if (Number(data) < minAllowable || Number(data) > maxAllowable) {
            setDisableSave(true)
        }
        else {
            setDisableSave(false)
        }
        // if (data) {
        //     setDisableSave(false)
        // } else {
        //     setTotalWeight(null)
        //     setDisableSave(true)
        // }
    }

    return (
        <Flex w='full' flexDirection='column'>

            <Text color='white' bgColor='secondary' textAlign='center'>Weighing Scale Information</Text>

            <HStack justifyContent='space-between' mt={2}>
                <HStack spacing={5}>
                    <Text bgColor='secondary' color='white' px={10} textAlign='start' fontSize='sm'>Batch:</Text>
                    <Text bgColor='gray.200' border='1px' px={12} fontSize='sm'>1</Text>
                </HStack>
                <HStack spacing={5}>
                    <Text bgColor='secondary' color='white' px={10} textAlign='start' fontSize='sm'>Quantity per Batch:</Text>
                    <Text bgColor='#fff8dc' border='1px' px={12} fontSize='sm'>{quantityPerBatch ? quantityPerBatch : 0}</Text>
                </HStack>
                <HStack spacing={1}>
                    <Text bgColor='secondary' color='white' px={10} textAlign='start' fontSize='sm'>Weighing Scale:</Text>
                    <FaCloudscale fontSize='25px' />
                    {/* <Text bgColor='gray.200' border='1px' px={12} fontSize='sm'>200</Text> */}
                    <Input
                        onChange={(e) => weightHandler(e.target.value)}
                        onWheel={(e) => e.target.blur()}
                        value={totalWeight}
                        ref={valueRef}
                        type='number'
                        placeholder='Weight is required'
                        h='15%' w='50%' bgColor='#fff8dc'
                    />
                </HStack>
            </HStack>

            <Text
                bgColor={batchRemaining ? '#fff8dc' : 'success'}
                mt={4} fontSize='sm' fontWeight='semibold'
                w='12.5%'
            >
                Batch Remaining: {batchRemaining ? batchRemaining : 'none'}
            </Text>

            <Flex bgColor='gray.200' justifyContent='end' mt={5}>
                <Button
                    onClick={() => onOpen()}
                    // disabled={!totalWeight || !batchRemaining}
                    disabled={disableSave || !batchRemaining}
                    size='sm' colorScheme='blue' px={7}
                >
                    Save
                </Button>
            </Flex>

            {
                isOpen && (
                    <SaveModal
                        isOpen={isOpen}
                        onClose={onClose}
                        transformId={transformId}
                        batchRemaining={batchRemaining}
                        fetchMixingRequest={fetchMixingRequest}
                        fetchRequirements={fetchRequirements}
                        fetchBatchRemaining={fetchBatchRemaining}
                        setMixingCue={setMixingCue}
                        valueRef={valueRef}
                        setDisableSave={setDisableSave}
                        requests={requests}
                        totalWeight={totalWeight}
                        setTotalWeight={setTotalWeight}
                    />
                )
            }

        </Flex>
    )
}

const SaveModal = ({ isOpen, onClose, transformId, batchRemaining, fetchMixingRequest,
    fetchRequirements, fetchBatchRemaining, setMixingCue, valueRef, setDisableSave, requests, totalWeight, setTotalWeight }) => {

    const toast = useToast()
    const [lotData, setLotData] = useState([])
    const [lotCategory, setLotCategory] = useState("")

    const [displayData, setDisplayData] = useState([])

    const date = new Date()
    const newDate = new Date(date.setMonth(date.getMonth() + 6))

    const { isOpen: isPrint, onOpen: openPrint, onClose: closePrint } = useDisclosure()

    const fetchLotCategoryApi = async () => {
        const res = await apiClient.get(`Lot/GetAllActiveLotCategories`)
        return res.data
    }

    const fetchLotCategory = () => {
        fetchLotCategoryApi().then(res => {
            setLotData(res)
        })
    }

    useEffect(() => {
        fetchLotCategory()

        return () => {
            setLotData([])
        }
    }, [])

    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const lotHandler = (lotName) => {
        if (lotName) {
            setLotCategory(lotName)
        } else {
            setLotCategory("")
        }
    }

    const submitHandler = () => {
        try {
            const res = apiClient.put(`Preparation/FinishedMixedMaterialsForWarehouse/${transformId}`, {
                transformId: transformId,
                lotCategory: lotCategory
            })
                .then(res => {
                    ToastComponent('Success', 'Mixing has started', 'success', toast)
                    const displayData = {
                        "Date": moment(new Date()).format('MM/DD/yyyy, h:mm:ss a'),
                        "Transform ID": transformId,
                        "Item Code": requests?.mixing[0]?.itemCode,
                        "Item Description": requests?.mixing[0]?.itemDescription,
                        "UOM": requests?.mixing[0]?.uom,
                        "Batch": `${res.data.batchCount} out of ${requests?.mixing[0]?.batch}`,
                        "Quantity": totalWeight && totalWeight,
                        "Mixing Date": moment(new Date()).format('MM/DD/yyyy'),
                        "Expiration Date": newDate && moment(newDate).format('MM/DD/yyyy'),
                        "Lot Name": lotCategory && lotCategory,
                    }
                    setDisplayData(displayData)
                    setTotalWeight('')
                    fetchMixingRequest()
                    fetchRequirements()
                    fetchBatchRemaining()
                    setDisableSave(true)
                    // valueRef.current.value = null
                    handlePrint()
                    openPrint()
                })
                .catch(err => {
                    ToastComponent('Error', err.response.data, 'error', toast)
                })
        } catch (error) {
        }
    }

    const newDisplayData = {
        "Date": displayData?.['Date'],
        "Transform ID": displayData?.['Transform ID'],
        "Item Code": displayData?.['Item Code'],
        "Item Description": displayData?.['Item Description'],
        "UOM": displayData?.['UOM'],
        "Batch": displayData?.['Batch'],
        "Quantity": displayData?.['Quantity'],
        "Mixing Date": displayData?.['Mixing Date'],
        "Expiration Date": displayData?.['Expiration Date'],
        "Lot Name": displayData?.['Lot Name'],
    }

    return (
        <Modal isCentered size='xl' isOpen={isOpen} onClose={() => { }}>
            <ModalContent>
                <ModalHeader bgColor='secondary'>
                    <Flex justifyContent='center'>
                        <Text fontSize='md' color='white'>Raw Materials LOT</Text>
                    </Flex>
                </ModalHeader>

                <ModalBody>

                    <Box w='20%' display='none'>

                        <VStack spacing={0} justifyContent='center' ref={componentRef}>

                            <VStack spacing={0} justifyContent='start'>
                                <Image
                                    src='/images/RDF Logo.png'
                                    w='20%' ml={3}
                                />
                                <Text fontSize='xs' ml={2}>Purok 6, Brgy. Lara, City of San Fernando, Pampanga, Philippines</Text>
                            </VStack>

                            <Flex mt={2} w='90%' justifyContent='center'>
                                <Text fontSize='25px' fontWeight='semibold' ml={4}>Raw Materials</Text>
                            </Flex>

                            {Object.keys(newDisplayData)?.map((key, i) =>
                                <Flex w='full' justifyContent='center' key={i}>
                                    <Flex ml='4%' w='full'>
                                        <Flex>
                                            <Text fontWeight='semibold' fontSize='10px'>{key}:</Text>
                                        </Flex>
                                    </Flex>
                                    <Flex w='full'>
                                        <Flex>
                                            <Text fontWeight='semibold' fontSize='10px'>{newDisplayData[key]}</Text>
                                        </Flex>
                                    </Flex>
                                </Flex>
                            )}

                            <VStack spacing={0} w='90%' ml={4} justifyContent='center'>
                                <Barcode width={3} height={75} value={newDisplayData?.['Transform ID']} />
                            </VStack>

                            <Flex w='full'></Flex>

                        </VStack>

                    </Box>

                    <VStack justifyContent='center'>
                        <Text my={4}>Where do you want to place this Raw Material?</Text>
                        {/* <HStack w='full' spacing={4} justifyContent='space-between'>
                            <Text w='60%'>Batch</Text>
                            <Input readOnly bgColor='gray.200' value={1 ? 1 : null} />
                        </HStack> */}
                        <HStack w='full' spacing={4} justifyContent='space-between'>
                            <Text w='60%'>Expiration Date</Text>
                            <Input readOnly bgColor='gray.200' value={moment(newDate).format("MM/DD/yyyy")} />
                        </HStack>
                        <HStack w='full' spacing={4} justifyContent='space-between'>
                            <Text w='57%'>Lot Name</Text>
                            {
                                lotData?.length > 0 ?
                                    <Select
                                        onChange={(e) => lotHandler(e.target.value)}
                                        placeholder='Please select a Lot Category'
                                        bgColor='#fff8dc'
                                    >
                                        {
                                            lotData?.map((lots, i) =>
                                                <option key={i} value={lots.categoryName}>{lots.categoryName}</option>
                                            )
                                        }
                                    </Select>
                                    : 'loading'
                            }
                        </HStack>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <ButtonGroup size='sm' mt={4}>
                        <Button
                            onClick={submitHandler}
                            disabled={!lotCategory}
                            colorScheme='blue'
                        >
                            Save
                        </Button>
                        <Button colorScheme='red' onClick={onClose}>Cancel</Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
            {
                isPrint && (
                    <PrintList
                        isOpen={isPrint}
                        onClose={closePrint}
                        closeSave={onClose}
                        requests={requests}
                        newDisplayData={newDisplayData}
                        valueRef={valueRef}
                        fetchMixingRequest={fetchMixingRequest}
                        fetchRequirements={fetchRequirements}
                        fetchBatchRemaining={fetchBatchRemaining}
                        setDisableSave={setDisableSave}
                        batchRemaining={batchRemaining}
                        setMixingCue={setMixingCue}
                    />
                )
            }
        </Modal>
    )
}