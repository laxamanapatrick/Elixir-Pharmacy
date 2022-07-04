import React from 'react'
import { Button, ButtonGroup, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text, useToast, VStack } from '@chakra-ui/react'
import { RiQuestionnaireLine } from 'react-icons/ri'
import apiClient from '../../../services/apiClient'
import { ToastComponent } from '../../../components/Toast'

export const AddQuantityConfirmation = ({ isOpen, onClose, id, orderNo, itemCode,
    quantityOrdered, fetchOrderList, fetchPreparedItems, setQuantity, expirationDate, setHighlighterId, warehouseId, setWarehouseId
}) => {

    const toast = useToast()

    const submitHandler = () => {
        console.log("Barcode: ", warehouseId)
        console.log("Order No P Key: ", id)
        console.log("Order No: ", orderNo)
        console.log("Item Code: ", itemCode)
        console.log("Quantity Ordered: ", Number(quantityOrdered))
        console.log("Expiration Date: ", expirationDate)
        try {
            const res = apiClient.post(`Ordering/PrepareItemsForMoveOrder`,
                {
                    warehouseId: warehouseId,
                    orderNoPkey: id,
                    orderNo: orderNo,
                    itemCode: itemCode,
                    quantityOrdered: Number(quantityOrdered),
                    expirationDate: expirationDate
                }
            )
                .then(res => {
                    ToastComponent("Success", "Quantity has been prepared.", "success", toast)
                    setQuantity('')
                    setHighlighterId('')
                    setWarehouseId('')
                    onClose()
                    fetchOrderList()
                    fetchPreparedItems()
                })
                .catch(err => {
                    ToastComponent("Error", err.response.data, "error", toast)
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
                            <Button colorScheme='blue' px={4} onClick={submitHandler}>Yes</Button>
                            <Button colorScheme='red' px={4} onClick={onClose}>No</Button>
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export const CancelConfirmation = ({ isOpen, onClose, id, fetchPreparedItems, fetchOrderList, setCancelId }) => {
    
    const toast = useToast()

    const submitHandler = () => {
        try {
            const res = apiClient.put(`Ordering/CancelPreparedItems`, { id: id })
                .then(res => {
                    ToastComponent("Success", "Successfully cancelled prepared item", "success", toast)
                    setCancelId('')
                    fetchPreparedItems()
                    fetchOrderList()
                    onClose()
                })
                .catch(err => {
                    ToastComponent("Error", "Cancel failed", "error", toast)
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
                            <Button colorScheme='blue' px={4} onClick={submitHandler}>Yes</Button>
                            <Button colorScheme='red' px={4} onClick={onClose}>No</Button>
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
