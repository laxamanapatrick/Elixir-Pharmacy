import React, { useState } from 'react'
import { Button, ButtonGroup, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text, toast, useDisclosure, useToast, VStack } from '@chakra-ui/react'
import { RiQuestionnaireLine } from 'react-icons/ri'
import apiClient from '../../../services/apiClient'
import { ToastComponent } from '../../../components/Toast'
import { decodeUser } from '../../../services/decode-user'

const currentUser = decodeUser()

//Add Button

export const AddQuantityConfirmation = ({ isOpen, onClose, id, orderNo, itemCode,
    quantityOrdered, fetchOrderList, fetchPreparedItems, setQuantity, expirationDate, setHighlighterId, warehouseId, setWarehouseId
}) => {

    const toast = useToast()
    const [isLoading, setIsLoading] = useState(false)

    const submitHandler = () => {
        setIsLoading(true)
        try {
            const res = apiClient.post(`Ordering/PrepareItemsForMoveOrder`,
                {
                    warehouseId: warehouseId,
                    orderNoPkey: id,
                    orderNo: orderNo,
                    itemCode: itemCode,
                    quantityOrdered: Number(quantityOrdered),
                    expirationDate: expirationDate,
                    preparedBy: currentUser.fullName
                }
            )
                .then(res => {
                    ToastComponent("Success", "Quantity has been prepared.", "success", toast)
                    setQuantity('')
                    setHighlighterId('')
                    setWarehouseId('')
                    setIsLoading(false)
                    onClose()
                    fetchOrderList()
                    fetchPreparedItems()
                })
                .catch(err => {
                    ToastComponent("Error", "Add Failed", "error", toast)
                    setIsLoading(false)
                })
        } catch (error) {
        }
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={() => { }} size='xl' isCentered>
                <ModalContent>
                    <ModalHeader>
                        <Flex justifyContent='center'>
                            <RiQuestionnaireLine fontSize='35px' />
                        </Flex>
                    </ModalHeader>
                    <ModalCloseButton onClick={onClose} />

                    <ModalBody>
                        <VStack justifyContent='center'>
                            <Text>Are you sure you want to add this quantity?</Text>
                            <Text>{`[ Order No. ${orderNo} ] [ Item Code ${itemCode} ] [ Quantity Ordered ${quantityOrdered} ]`}</Text>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <ButtonGroup size='sm' mt={3}>
                            <Button
                                onClick={submitHandler}
                                isLoading={isLoading}
                                disabled={isLoading}
                                colorScheme='blue' px={4}
                            >
                                Yes
                            </Button>
                            <Button
                                onClick={onClose}
                                isLoading={isLoading}
                                disabled={isLoading}
                                colorScheme='red' px={4}
                            >
                                No
                            </Button>
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

//Cancel Prepared

export const CancelConfirmation = ({ isOpen, onClose, id, fetchPreparedItems, fetchOrderList, setCancelId }) => {

    const toast = useToast()
    const [isLoading, setIsLoading] = useState(false)

    const submitHandler = () => {
        setIsLoading(true)
        try {
            const res = apiClient.put(`Ordering/CancelPreparedItems`, { id: id })
                .then(res => {
                    ToastComponent("Success", "Successfully cancelled prepared item", "success", toast)
                    setCancelId('')
                    fetchPreparedItems()
                    fetchOrderList()
                    setIsLoading(false)
                    onClose()
                })
                .catch(err => {
                    ToastComponent("Error", "Cancel failed", "error", toast)
                    setIsLoading(false)
                })
        } catch (error) {
        }
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={() => { }} size='xl' isCentered>
                <ModalContent>
                    <ModalHeader>
                        <Flex justifyContent='center'>
                            <RiQuestionnaireLine fontSize='35px' />
                        </Flex>
                    </ModalHeader>
                    <ModalCloseButton onClick={onClose} />

                    <ModalBody>
                        <VStack justifyContent='center'>
                            <Text>Are you sure you want to cancel this prepared item?</Text>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <ButtonGroup size='sm' mt={3}>
                            <Button
                                onClick={submitHandler}
                                isLoading={isLoading}
                                disabled={isLoading}
                                colorScheme='blue' px={4}
                            >
                                Yes
                            </Button>
                            <Button
                                onClick={onClose}
                                isLoading={isLoading}
                                disabled={isLoading}
                                colorScheme='red' px={4}
                            >
                                No
                            </Button>
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

//Save Button

export const SaveButton = ({ deliveryStatus, batchNumber, orderListData, fetchApprovedMoveOrders, fetchOrderList,
    setOrderId, setHighlighterId, setItemCode, setDeliveryStatus, setButtonChanger, setCurrentPage, currentPage, fetchNotification }) => {

    const { isOpen: isPlateNumber, onClose: closePlateNumber, onOpen: openPlateNumber } = useDisclosure()

    return (
        <Flex w='full' justifyContent='end'>
            <Button
                onClick={() => openPlateNumber()}
                disabled={!deliveryStatus || !batchNumber}
                title={deliveryStatus ? `Save with delivery status "${deliveryStatus}" and batch number "${batchNumber}"` : 'Please select a delivery status and batch number.'}
                size='sm' colorScheme='blue' px={6}
            >
                Save
            </Button>
            {
                <DeliveryStatusConfirmation
                    isOpen={isPlateNumber}
                    onClose={closePlateNumber}
                    deliveryStatus={deliveryStatus}
                    batchNumber={batchNumber}
                    orderListData={orderListData}
                    fetchApprovedMoveOrders={fetchApprovedMoveOrders}
                    fetchOrderList={fetchOrderList}
                    setOrderId={setOrderId}
                    setHighlighterId={setHighlighterId}
                    setItemCode={setItemCode}
                    setDeliveryStatus={setDeliveryStatus}
                    setButtonChanger={setButtonChanger}
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                    fetchNotification={fetchNotification}
                />
            }
        </Flex>
    )
}
export const DeliveryStatusConfirmation = ({ isOpen, onClose, deliveryStatus, batchNumber, orderListData, fetchApprovedMoveOrders, fetchOrderList,
    setOrderId, setHighlighterId, setItemCode, setDeliveryStatus, setButtonChanger, setCurrentPage, currentPage, fetchNotification }) => {

    const toast = useToast()
    const [isLoading, setIsLoading] = useState(false)

    const submitHandler = () => {
        const submitArray = orderListData?.map(item => {
            return {
                id: item.id,
                deliveryStatus: deliveryStatus,
                batchNo: batchNumber
            }
        })
        setIsLoading(true)
        try {
            const res = apiClient.put(`Ordering/AddDeliveryStatus`, submitArray)
                .then(res => {
                    ToastComponent("Success", "Items prepared successfully.", "success", toast)
                    fetchNotification()
                    setOrderId('')
                    setHighlighterId('')
                    setItemCode('')
                    setDeliveryStatus('')
                    setButtonChanger(false)
                    setCurrentPage(currentPage)
                    fetchApprovedMoveOrders()
                    fetchOrderList()
                    setIsLoading(false)
                    onClose()
                })
                .catch(err => {
                    ToastComponent("Error", "Save failed.", "error", toast)
                    setIsLoading(false)
                })
        } catch (error) {
        }
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={() => { }} size='xl' isCentered>
                <ModalContent>
                    <ModalHeader>
                        <Flex justifyContent='center'>
                            <RiQuestionnaireLine fontSize='35px' />
                        </Flex>
                    </ModalHeader>
                    <ModalCloseButton onClick={onClose} />

                    <ModalBody>
                        <VStack justifyContent='center'>
                            <Text>Are you sure you want to save these prepared items?</Text>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <ButtonGroup size='sm' mt={3}>
                            <Button
                                onClick={submitHandler}
                                isLoading={isLoading}
                                disabled={isLoading}
                                colorScheme='blue' px={4}
                            >
                                Yes
                            </Button>
                            <Button
                                onClick={onClose}
                                isLoading={isLoading}
                                disabled={isLoading}
                                colorScheme='red' px={4}
                            >
                                No
                            </Button>
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}


//Cancel Approved Date
export const CancelApprovedDate = ({ isOpen, onClose, id, setOrderId, fetchApprovedMoveOrders }) => {

    const toast = useToast()
    const [isLoading, setIsLoading] = useState(false)

    const submitHandler = () => {
        setIsLoading(true)
        console.log(id)
        try {
            const res = apiClient.put(`Ordering/CancelOrdersInMoveOrder`, { orderNoPkey: id })
                .then(res => {
                    ToastComponent("Success", "Successfully cancelled approved date", "success", toast)
                    setOrderId('')
                    fetchApprovedMoveOrders()
                    setIsLoading(false)
                    onClose()
                })
                .catch(err => {
                    ToastComponent("Error", "Cancel failed", "error", toast)
                    setIsLoading(false)
                })
        } catch (error) {
        }
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={() => { }} size='xl' isCentered>
                <ModalContent>
                    <ModalHeader>
                        <Flex justifyContent='center'>
                            <RiQuestionnaireLine fontSize='35px' />
                        </Flex>
                    </ModalHeader>
                    <ModalCloseButton onClick={onClose} />

                    <ModalBody>
                        <VStack justifyContent='center'>
                            <Text>Are you sure you want to cancel this approved date for re-scheduling?</Text>
                        </VStack>
                    </ModalBody>

                    <ModalFooter mt={10}>
                        <ButtonGroup size='sm' mt={3}>
                            <Button
                                onClick={submitHandler}
                                isLoading={isLoading}
                                disabled={isLoading}
                                colorScheme='blue' px={4}
                            >
                                Yes
                            </Button>
                            <Button
                                onClick={onClose}
                                isLoading={isLoading}
                                disabled={isLoading}
                                colorScheme='red' px={4}
                            >
                                No
                            </Button>
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
