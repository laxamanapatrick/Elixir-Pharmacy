import React, { useState, useEffect } from 'react'
import { Box, Button, ButtonGroup, Flex, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Select, Text, useDisclosure, useToast, VStack } from '@chakra-ui/react'
import { FaCloudscale } from 'react-icons/fa'
import { ToastComponent } from '../../../components/Toast'
import apiClient from '../../../services/apiClient'
import moment from 'moment'

export const WeighingScaleInformation = ({ transformId, batchRemaining, fetchMixingRequest, fetchRequirements, fetchBatchRemaining, setMixingCue }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <Flex w='full' flexDirection='column'>

            <Text color='white' bgColor='secondary' textAlign='center'>Weighing Scale Information</Text>

            <HStack justifyContent='space-between' mt={2}>
                <HStack spacing={5}>
                    <Text bgColor='secondary' color='white' px={10} textAlign='start' fontSize='sm'>Batch:</Text>
                    <Text bgColor='gray.200' border='1px' px={12} fontSize='sm'>1</Text>
                </HStack>
                <HStack spacing={5}>
                    <Text bgColor='secondary' color='white' px={10} textAlign='start' fontSize='sm'>Quantity Batch:</Text>
                    <Text bgColor='gray.200' border='1px' px={12} fontSize='sm'>150</Text>
                </HStack>
                <HStack spacing={1}>
                    <Text bgColor='secondary' color='white' px={10} textAlign='start' fontSize='sm'>Weighing Scale:</Text>
                    <FaCloudscale fontSize='25px' />
                    <Text bgColor='gray.200' border='1px' px={12} fontSize='sm'>200</Text>
                </HStack>
            </HStack>

            <Text mt={4} fontSize='sm' fontWeight='semibold'>Batch Remaining: {batchRemaining ? batchRemaining : 'none'}</Text>

            <Flex bgColor='gray.200' justifyContent='end' mt={5}>
                <Button size='sm' colorScheme='blue' px={7} onClick={() => onOpen()}>Save</Button>
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
                    />
                )
            }

        </Flex>
    )
}

const SaveModal = ({ isOpen, onClose, transformId, batchRemaining, fetchMixingRequest, fetchRequirements, fetchBatchRemaining, setMixingCue }) => {

    const toast = useToast()
    const [lotData, setLotData] = useState([])
    const [lotCategory, setLotCategory] = useState("")
    
    const date = new Date()
    const newDate = new Date(date.setMonth(date.getMonth()+6))

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

    const submitHandler = () => {
        try {
            const res = apiClient.put(`Preparation/FinishedMixedMaterialsForWarehouse/${transformId}`, {
                transformId: transformId,
                lotCategory: lotCategory
            })
                .then(res => {
                    ToastComponent('Success', 'Mixing has started', 'success', toast)
                    fetchMixingRequest()
                    fetchRequirements()
                    fetchBatchRemaining()
                    setMixingCue(false)
                    onClose()
                })
                .catch(err => {
                    ToastComponent('Error', err.response.data, 'error', toast)
                })
        } catch (error) {
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
        </Modal>
    )
}