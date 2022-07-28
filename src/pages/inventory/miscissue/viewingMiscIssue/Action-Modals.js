import React, { useEffect, useState } from 'react'
import { Button, ButtonGroup, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text, Table, Tbody, Td, Th, Thead, Tr, useToast } from '@chakra-ui/react'
import { BsQuestionOctagonFill } from 'react-icons/bs'
import apiClient from '../../../../services/apiClient'
import { ToastComponent } from '../../../../components/Toast'
import PageScrollReusable from '../../../../components/PageScroll-Reusable'

export const StatusConfirmation = ({ isOpen, onClose, statusBody, fetchIssues }) => {

    const toast = useToast()
    const [isLoading, setIsLoading] = useState(false)

    const submitHandler = () => {
        let routeLabel;
        if (statusBody.status) {
            routeLabel = "InActiveReceipt"
        } else {
            routeLabel = "ActivateReceipt"
        }
        setIsLoading(true)
        apiClient.put(`Miscellaneous/${routeLabel}`, { id: statusBody.id }).then((res) => {
            ToastComponent("Success", "Status updated", "success", toast)
            fetchIssues()
            setIsLoading(false)
            onClose()
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <Modal isOpen={isOpen} onClose={() => { }} size='xl' isCentered>
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent='center'>
                        <BsQuestionOctagonFill fontSize='50px' />
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />
                <ModalBody mb={5}>
                    <Flex justifyContent='center'>
                        <Text>{`Are you sure you want to set this receipt ${statusBody?.status ? 'inactive' : 'active'}?`}</Text>
                    </Flex>
                </ModalBody>
                <ModalFooter>
                    <ButtonGroup size='sm'>
                        <Button colorScheme='blue' onClick={submitHandler} isLoading={isLoading} disabled={isLoading}>Yes</Button>
                        <Button colorScheme='red' onClick={onClose} isLoading={isLoading} disabled={isLoading}>No</Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export const ViewModal = ({ isOpen, onClose, statusBody }) => {

    const [receiptDetailsData, setReceiptDetailsData] = useState([])

    const id = statusBody.id
    const fetchReceiptDetailsApi = async (id) => {
        const res = await apiClient.get(`Miscellaneous/GetAllDetailsFromWarehouseByMReceipt?id=${id}`)
        return res.data
    }

    const fetchReceiptDetails = () => {
        fetchReceiptDetailsApi(id).then(res => {
            setReceiptDetailsData(res)
        })
    }

    useEffect(() => {
        fetchReceiptDetails()
    }, [id])

    return (
        <Modal isOpen={isOpen} onClose={() => { }} size='5xl' isCentered>
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent='center'>
                        <Text>Receipt Details</Text>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />
                <ModalBody mb={5}>
                    <Flex justifyContent='center'>
                        <PageScrollReusable minHeight='350px' maxHeight='351px'>
                            <Table size='sm'>
                                <Thead bgColor='secondary'>
                                    <Tr>
                                        <Th color='white'>Item Code</Th>
                                        <Th color='white'>Item Description</Th>
                                        <Th color='white'>Quantity</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {
                                        receiptDetailsData?.map((receiptdetails, i) =>
                                            <Tr key={i}>
                                                <Td>{receiptdetails.itemCode}</Td>
                                                <Td>{receiptdetails.itemDescription}</Td>
                                                <Td>{receiptdetails.quantity}</Td>
                                            </Tr>
                                        )
                                    }
                                </Tbody>
                            </Table>
                        </PageScrollReusable>
                    </Flex>
                </ModalBody>
                <ModalFooter>
                    <ButtonGroup size='sm'>
                        <Button colorScheme='gray' onClick={onClose}>Close</Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

