import React, { useState, useEffect } from 'react'
import { Button, ButtonGroup, Flex, Heading, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Select, Text, toast, useDisclosure, useToast, VStack } from '@chakra-ui/react'
import { BsFillQuestionOctagonFill } from 'react-icons/bs'
import PageScrollReusable from '../../../components/PageScroll-Reusable'
import apiClient from '../../../services/apiClient'
import { ToastComponent } from '../../../components/Toast'
import { decodeUser } from '../../../services/decode-user'
import DatePicker from 'react-datepicker'
import { BsQuestionOctagonFill } from 'react-icons/bs'

const currentUser = decodeUser()

export const EditModal = ({ isOpen, onClose, editData, setCurrentPage, currentPage, fetchOrders }) => {

    const [quantitySubmit, setQuantitySubmit] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const quantityHandler = (data) => {
        if (data) {
            setQuantitySubmit(parseFloat(data))
        } else {
            setQuantitySubmit('')
        }
    }

    const submitHandler = () => {
        setIsLoading(true)
        try {
            const res = apiClient.put(`Ordering/EditOrderQuantity`,
                {
                    id: editData.transactId,
                    quantityOrdered: quantitySubmit
                }
            )
                .then(res => {
                    ToastComponent("Success", "Order has been edited!", "success", toast)
                    onClose()
                    fetchOrders()
                    setCurrentPage(currentPage)
                })
                .catch(err => {
                    ToastComponent("Error", err.response.data, "error", toast)
                    setIsLoading(false)
                })
        } catch (error) {
        }
    }

    const titles = ['Farm', 'Item Code', 'Item Description', 'UOM', 'Quantity Order']
    const autofilled = [editData?.farm, editData?.itemCode, editData?.itemDescription, editData?.uom]

    return (
        <>
            <Modal isOpen={isOpen} onClose={() => { }} isCentered size='xl'>
                <ModalContent>
                    <ModalHeader>
                        <Flex justifyContent='center' bgColor='secondary' py={2}>
                            <Heading fontSize='lg' color='white'>Edit Order</Heading>
                        </Flex>
                    </ModalHeader>

                    <ModalBody>
                        {/* <PageScrollReusable minHeight='50px' maxHeight='350px'> */}
                        <Text textAlign='center' mb={7}>Are you sure you want to edit this order?</Text>
                        <HStack justifyContent='center' textAlign='start'>
                            <VStack spacing={4}>
                                {titles.map((title) => (
                                    <Text w='full' pl={2} key={title}>{title}</Text>
                                ))}
                            </VStack>
                            <VStack spacing={3.5}>
                                {autofilled.map((items) => (
                                    <Text w='70%' pl={2} bgColor='gray.200' border='1px' key={items}>{items}</Text>
                                ))}
                                <Input
                                    onChange={(e) => quantityHandler(e.target.value)}
                                    value={quantitySubmit}
                                    type="number"
                                    onWheel={(e) => e.target.blur()}
                                    onKeyDown={(e) => ["E", "e", "+", "-"].includes(e.key) && e.preventDefault()}
                                    onPaste={(e) => e.preventDefault()}
                                    w='72%' pl={2} h={7} bgColor='#fff8dc' border='1px'
                                />
                            </VStack>
                        </HStack>
                        {/* </PageScrollReusable> */}
                    </ModalBody>

                    <ModalFooter>
                        <ButtonGroup size='xs' mt={5}>
                            <Button px={4}
                                onClick={submitHandler}
                                isLoading={isLoading}
                                disabled={!quantitySubmit || isLoading}
                                colorScheme='blue'
                            >
                                Save
                            </Button>
                            <Button
                                onClick={onClose}
                                isLoading={isLoading}
                                disabled={isLoading}
                                colorScheme='red'
                            >
                                Cancel
                            </Button>
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export const CancelModalConfirmation = ({ isOpen, onClose, cancelId, setCurrentPage, currentPage, fetchOrders, orders, fetchNotification }) => {

    const [cancelRemarks, setCancelRemarks] = useState('')
    const [reasons, setReasons] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const toast = useToast()

    const fetchReasonsApi = async () => {
        const res = await apiClient.get(`Reason/GetAllActiveReason`)
        return res.data
    }

    const fetchReasons = () => {
        fetchReasonsApi().then(res => {
            setReasons(res)
        })
    }

    useEffect(() => {
        fetchReasons()

        return () => {
            setReasons([])
        }
    }, [])

    const remarksHandler = (data) => {
        if (data) {
            setCancelRemarks(data)
        } else {
            setCancelRemarks('')
        }
    }

    const cancelHandler = () => {
        setIsLoading(true)
        try {
            const res = apiClient.put(`Ordering/CancelOrders`,
                {
                    id: cancelId,
                    remarks: cancelRemarks,
                    isCancelBy: currentUser.fullName
                }
            )
                .then(res => {
                    setCurrentPage(currentPage)
                    ToastComponent("Success", "Order has been cancelled!", "success", toast)
                    fetchNotification()
                    setIsLoading(false)
                    onClose()
                    fetchOrders()
                })
                .catch(err => {
                    ToastComponent("Error", "Cancel failed!", "error", toast)
                    setIsLoading(false)
                })
        } catch (error) {
        }
    }

    return (
        <Modal isCentered size='xl' isOpen={isOpen} onClose={() => { }}>
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent='center' mt={10}>
                        <BsFillQuestionOctagonFill fontSize='50px' />
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />
                <ModalBody>
                    <VStack justifyContent='center' mb={8}>
                        <Text>Are you sure you want to cancel this order?</Text>
                        {
                            reasons.length > 0 ?
                                <Select
                                    onChange={(e) => remarksHandler(e.target.value)}
                                    placeholder='Please select a reason'
                                    w='65%' bgColor='#fff8dc'
                                >
                                    {
                                        reasons?.map((item, i) =>
                                            <option key={i} value={item.reasonName}>{item.reasonName}</option>
                                        )
                                    }
                                </Select>
                                : 'loading'
                        }
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button
                        onClick={() => cancelHandler()}
                        disabled={!cancelRemarks}
                        isLoading={isLoading}
                        colorScheme='blue' mr={3} _hover={{ bgColor: 'accent' }}
                    >
                        Yes
                    </Button>
                    <Button colorScheme='red' onClick={onClose}
                        disabled={isLoading}
                        isLoading={isLoading}
                    >No</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export const ScheduleConfirmation = ({ isOpen, onClose, checkedItems, setCheckedItems,
    farmName, fetchOrders, setCurrentPage, currentPage, fetchNotification }) => {

    const [preparationDate, setPreparationDate] = useState(new Date())
    const date = new Date()
    const maxDate = new Date(date.setMonth(date.getMonth() + 6))

    const { isOpen: isSchedValidate, onOpen: openSchedValidate, onClose: closeSchedValidate } = useDisclosure()

    const dateProvider = (date) => {
        if (date) {
            setPreparationDate(date)
        } else {
            setPreparationDate('')
        }
    }

    const submitValidate = () => {
        openSchedValidate()
    }

    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered size='xl'>
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent='center' bgColor='secondary' py={2}>
                        <Heading fontSize='lg' color='white'>Schedule</Heading>
                    </Flex>
                </ModalHeader>

                <ModalBody>
                    <VStack textAlign='start'>
                        <HStack spacing={4} w='full' justifyContent='center'>
                            <Text w='40%' pl={2}>Farm:</Text>
                            <Text w='97%' pl={2} py={2} bgColor='gray.200' border='1px'>{farmName && farmName}</Text>
                        </HStack>
                        <HStack spacing={4} w='full' justifyContent='center'>
                            <Text w='40%' pl={2}>Preparation Date:</Text>
                            <DatePicker
                                onChange={(date) => dateProvider(date)}
                                minDate={new Date()}
                                maxDate={maxDate}
                                shouldCloseOnSelect
                                selected={preparationDate}
                            />
                        </HStack>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <ButtonGroup size='xs' mt={8}>
                        <Button px={5} colorScheme='blue' disabled={!preparationDate} onClick={submitValidate}>Yes</Button>
                        <Button colorScheme='red' onClick={onClose}>Cancel</Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
            {
                isSchedValidate && (
                    <ScheduleValidation
                        isOpen={isSchedValidate}
                        onClose={closeSchedValidate}
                        closeSchedule={onClose}
                        preparationDate={preparationDate}
                        checkedItems={checkedItems}
                        setCheckedItems={setCheckedItems}
                        fetchOrders={fetchOrders}
                        setCurrentPage={setCurrentPage}
                        currentPage={currentPage}
                        fetchNotification={fetchNotification}
                    />
                )
            }
        </Modal>
    )
}

const ScheduleValidation = ({ isOpen, onClose, closeSchedule, preparationDate, checkedItems, setCheckedItems, fetchOrders, setCurrentPage, currentPage, fetchNotification }) => {

    const toast = useToast()
    const [isLoading, setIsLoading] = useState(false)

    const submitHandler = () => {
        const submitArray = checkedItems?.map(item => {
            return {
                id: item,
                preparedDate: preparationDate,
                preparedBy: currentUser.fullName
            }
        })
        setIsLoading(true)
        try {
            const res = apiClient.put(`Ordering/SchedulePreparedOrderedDate`, submitArray)
                .then(res => {
                    ToastComponent("Success", "Orders were successfully scheduled", "success", toast)
                    fetchNotification()
                    onClose()
                    closeSchedule()
                    setCurrentPage(currentPage)
                    setCheckedItems([])
                    fetchOrders()
                    setIsLoading(false)
                })
                .catch(err => {
                    ToastComponent("Error", "Schedule failed", "error", toast)
                    setIsLoading(false)
                })
        } catch (error) {
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered size='xl'>
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent='center' py={2}>
                        <BsQuestionOctagonFill fontSize='40px' />
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />

                <ModalBody>
                    <Text mt={5} textAlign='center'>Are you sure you want to schedule these ({checkedItems?.length}) orders?</Text>
                </ModalBody>

                <ModalFooter>
                    <ButtonGroup size='md' mt={10}>
                        <Button
                            px={5} colorScheme='blue'
                            isLoading={isLoading}
                            disabled={!preparationDate || isLoading}
                            onClick={submitHandler}
                        >
                            Yes
                        </Button>
                        <Button
                            onClick={onClose}
                            isLoading={isLoading}
                            disabled={isLoading}
                            colorScheme='red'
                        >
                            Cancel
                        </Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
