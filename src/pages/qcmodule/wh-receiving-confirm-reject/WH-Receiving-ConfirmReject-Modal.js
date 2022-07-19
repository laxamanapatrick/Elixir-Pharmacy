import React, { useState, useEffect } from 'react'
import {
    Button,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Flex,
    Tr,
    Stack,
    Skeleton,
    Table,
    Thead,
    Th,
    Td,
    Tbody,
} from '@chakra-ui/react';
import PageScrollModal from '../../../components/PageScrollModal'
import apiClient from '../../../services/apiClient';

const ViewingModal = ({ viewingId, viewingData, isOpen, onClose }) => {

    const [rejectedMaterialsListData, setRejectedMaterialsListData] = useState([])

    const fetchRejectedMaterialsListApi = async () => {
        const res = await apiClient.get(`Warehouse/GetRejectMaterialsInWarehouse/${viewingId}`)
        return res.data
    }

    const fetchRejectMaterialsList = () => {
        fetchRejectedMaterialsListApi().then(res => {
            // setIsLoading(false)
            setRejectedMaterialsListData(res)
            // setPageTotal(res.totalCount)
        })
    }

    useEffect(() => {
        fetchRejectMaterialsList()

        return () => {
            setRejectedMaterialsListData([])
        }
    }, []);

    return (
        <Flex>
            <Modal size='5xl' isOpen={isOpen} onClose={() => { }} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <Flex justifyContent='center'>
                            <Text>
                                Rejected Raw Materials
                            </Text>
                        </Flex>
                    </ModalHeader>
                    <ModalCloseButton onClick={onClose} />

                    <ModalBody>

                        <PageScrollModal>
                            {
                                !rejectedMaterialsListData ? (
                                    <Stack width="full">
                                        <Skeleton height='20px' />
                                        <Skeleton height='20px' />
                                        <Skeleton height='20px' />
                                        <Skeleton height='20px' />
                                        <Skeleton height='20px' />
                                        <Skeleton height='20px' />
                                    </Stack>
                                ) : (
                                    <Table variant='striped' size='sm'>

                                        <Thead>
                                            <Tr bgColor='secondary'>
                                                <Th color='white'>PO No.</Th>
                                                <Th color='white'>Item Code</Th>
                                                <Th color='white'>Description</Th>
                                                <Th color='white'>Supplier</Th>
                                                <Th color='white'>UOM</Th>
                                                <Th color='white'>Actual Reject</Th>
                                                <Th color='white'>Date Rejected</Th>
                                                <Th color='white'>Remarks</Th>
                                            </Tr>
                                        </Thead>

                                        <Tbody>
                                            {
                                                rejectedMaterialsListData?.map((list, i) =>
                                                    <Tr key={i}>
                                                        <Td>{viewingData.pO_Number}</Td>
                                                        <Td>{viewingData.itemCode}</Td>
                                                        <Td>{viewingData.itemDescription}</Td>
                                                        <Td>{viewingData.supplier}</Td>
                                                        <Td>{viewingData.uom}</Td>
                                                        <Td>{list.quantity}</Td>
                                                        <Td>{list.rejectDate}</Td>
                                                        <Td>{list.remarks}</Td>
                                                    </Tr>

                                                )
                                            }
                                        </Tbody>

                                    </Table>
                                )}
                        </PageScrollModal>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant='outline' onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex >
    )
}

export default ViewingModal