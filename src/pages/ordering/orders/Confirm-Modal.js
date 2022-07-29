import React from 'react'
import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text, useToast, VStack } from '@chakra-ui/react'
import { BsFillQuestionOctagonFill } from 'react-icons/bs'
import apiClient from '../../../services/apiClient'
import { ToastComponent } from '../../../components/Toast'
import moment from 'moment'

export const ConfirmModal = ({ isOpen, onClose, resultArray, setIsLoading, setErrorData, openError, isLoading }) => {

    const toast = useToast()

    const syncHandler = () => {
        try {
            setIsLoading(true)
            const res = apiClient.post(`Ordering/AddNewOrders`,
                resultArray.map(item => ({
                    transactId: item?.transactId,
                    customerName: item?.customerName,
                    customerPosition: item?.customerPosition,
                    farmType: item?.farmType,
                    farmCode: item?.farmCode,
                    farmName: item?.farmName,
                    orderNo: item?.orderNo,
                    batchNo: parseInt(item?.batchNo),
                    orderDate: moment(item?.orderDate).format("yyyy-MM-DD"),
                    dateNeeded: moment(item?.dateNeeded).format("yyyy-MM-DD"),
                    timeNeeded: item?.dateNeeded,
                    transactionType: item?.transactionType,
                    itemCode: item?.itemCode,
                    itemDescription: item?.itemDescription,
                    uom: item?.uom,
                    quantityOrdered: item?.quantityOrdered,
                    category: item?.category
                }))
            )
                .then(res => {
                    ToastComponent("Success", "Orders Synced!", "success", toast)
                    setIsLoading(false)
                })
                .catch(err => {
                    setIsLoading(false)
                    setErrorData(err.response.data)
                    if (err.response.data) {
                        onClose()
                        openError()
                    }
                })
        } catch (error) {
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={() => { }} size='xl' isCentered>
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent='center'>
                        <BsFillQuestionOctagonFill fontSize='50px' />
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />

                <ModalBody>
                    <VStack justifyContent='center'>
                        <Text>Are you sure you want sync these orders?</Text>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button isLoading={isLoading} onClick={() => syncHandler()} colorScheme='blue'>Yes</Button>
                    <Button ml={2} colorScheme='red' onClick={onClose}>No</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
