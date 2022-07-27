import React, { useState, useEffect, useRef } from 'react'
import { Box, Button, ButtonGroup, Flex, HStack, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Select, Text, useDisclosure, useToast, VStack } from '@chakra-ui/react'
import { FaCloudscale } from 'react-icons/fa'
import apiClient from '../../../services/apiClient'
import { SaveConfirmation } from './Print-List'
import DatePicker from "react-datepicker";

export const WeighingScaleInformation = ({ transformId, batchRemaining, fetchMixingRequest, fetchRequirements,
    fetchBatchRemaining, setMixingCue, quantity, requests, batch, setCurrentPage, fetchNotification, quantityBasis }) => {

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

    const quantityPerBatch = Number(quantityBasis) / Number(batch)
    const weightHandler = (data) => {
        setTotalWeight(data)
        const minAllowable = Number(quantityPerBatch) - (Number(quantityPerBatch) * 0.001)
        const maxAllowable = Number(quantityPerBatch)
        if (Number(data) < minAllowable || Number(data) > maxAllowable) {
            setDisableSave(true)
        }
        else {
            setDisableSave(false)
        }
    }

    console.log(quantityBasis)

    return (
        <Flex w='full' flexDirection='column'>

            <Text color='white' bgColor='secondary' textAlign='center'>Weighing Scale Information</Text>

            <HStack justifyContent='space-between' mt={2}>
                <HStack spacing={5}>
                    <Text bgColor='secondary' color='white' px={10} textAlign='start' fontSize='sm'>Batch:</Text>
                    <Text bgColor='gray.200' border='1px' px={12} fontSize='sm'>1</Text>
                </HStack>
                <HStack spacing={5}>
                    <Text bgColor='secondary' color='white' px={10} textAlign='start' fontSize='sm'>Allowed max quantity on this batch:</Text>
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
                        setCurrentPage={setCurrentPage}
                        fetchNotification={fetchNotification}
                    />
                )
            }

        </Flex>
    )
}

const SaveModal = ({ isOpen, onClose, transformId, batchRemaining, fetchMixingRequest,
    fetchRequirements, fetchBatchRemaining, setMixingCue, valueRef, setDisableSave,
    requests, totalWeight, setTotalWeight, setCurrentPage, fetchNotification }) => {

    const toast = useToast()
    const [lotData, setLotData] = useState([])
    const [lotCategory, setLotCategory] = useState("")

    const date = new Date()
    const newDate = new Date(date.setMonth(date.getMonth() + 6))
    const [expirationDate, setExpirationDate] = useState(newDate)

    const { isOpen: isSaveConfirmation, onClose: closeSaveConfirmation, onOpen: openSaveConfirmation } = useDisclosure()

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

    const lotHandler = (lotName) => {
        if (lotName) {
            setLotCategory(lotName)
        } else {
            setLotCategory("")
        }
    }

    const expirationDateProvider = (date) => {
        if (date) {
            setExpirationDate(date)
        } else {
            setExpirationDate(date)
        }
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

                    <VStack justifyContent='center'>
                        <Text my={4}>Where do you want to place this Raw Material?</Text>
                        {/* <HStack w='full' spacing={4} justifyContent='space-between'>
                            <Text w='60%'>Batch</Text>
                            <Input readOnly bgColor='gray.200' value={1 ? 1 : null} />
                        </HStack> */}
                        <HStack w='full' spacing={4} justifyContent='space-between'>
                            <Text w='60%'>Expiration Date</Text>
                            {/* <Input readOnly bgColor='gray.200' value={moment(newDate).format("MM/DD/yyyy")} /> */}
                            <DatePicker
                                onChange={(date) => expirationDateProvider(date)}
                                minDate={new Date()}
                                maxDate={new Date(new Date(date.setMonth(date.getMonth() + 9)))}
                                shouldCloseOnSelect
                                selected={expirationDate}
                            // className='chakra-input css-7s3glp'
                            // wrapperClassName='datePicker'
                            />
                        </HStack>
                        <HStack w='full' spacing={4} justifyContent='space-between'>
                            <Text w='60%'>Lot Name</Text>
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
                            onClick={() => openSaveConfirmation()}
                            disabled={!lotCategory || !expirationDate}
                            colorScheme='blue'
                        >
                            Save
                        </Button>
                        <Button colorScheme='red' onClick={onClose}>Cancel</Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>

            {
                isSaveConfirmation && (
                    <SaveConfirmation
                        isOpen={isSaveConfirmation}
                        onClose={closeSaveConfirmation}
                        closeSaveModal={onClose}
                        transformId={transformId}
                        lotCategory={lotCategory}
                        expirationDate={expirationDate}
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
                        setCurrentPage={setCurrentPage}
                        fetchNotification={fetchNotification}
                    />
                )
            }

        </Modal>
    )
}
