import React, { useState, useEffect } from 'react'
import {
    Button,
    Flex,
    Heading,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useDisclosure,
    useToast,
    VStack
} from '@chakra-ui/react'
import { BsFillQuestionOctagonFill } from 'react-icons/bs'
import PageScrollTransformation from '../../../../components/PageScroll-Transformation'
import apiClient from '../../../../services/apiClient'
import { ToastComponent } from '../../../../components/Toast'

export const ListofRequest = ({ setTransformId, transformId, requests, fetchRequests, fetchRequirements, fetchNotification }) => {

    const [cancelId, setCancelId] = useState(null)

    const { isOpen, onOpen, onClose } = useDisclosure()

    const requirementsHandler = (data) => {
        setTransformId(data)
    }

    const cancelHandler = (data) => {
        setCancelId(data)
        onOpen()
    }

    return (
        <Flex w='90%' flexDirection='column'>
            <Flex justifyContent='center' bgColor='secondary' p={1}>
                <Heading color='white' fontSize='l' fontWeight='semibold'>List of Request</Heading>
            </Flex>
            <Flex>
                <PageScrollTransformation minHeight='100px' maxHeight='190px'>
                    <Table variant='simple' size='sm'>
                        <Thead bgColor='secondary'>
                            <Tr>
                                <Th color='white'>Line</Th>
                                <Th color='white'>Transform Id</Th>
                                <Th color='white'>Item Code</Th>
                                <Th color='white'>Item Description</Th>
                                <Th color='white'>UOM</Th>
                                <Th color='white'>Batch</Th>
                                <Th color='white'>Version</Th>
                                <Th color='white'>Total Quantity</Th>
                                <Th color='white'>Prod Plan</Th>
                                <Th color='white'>Request By</Th>
                                <Th color='white'>Cancel</Th>
                            </Tr>
                        </Thead>

                        <Tbody>
                            {
                                requests?.map((r, i) =>
                                    <Tr
                                        key={i} onClick={() => requirementsHandler(r.id)}
                                        bgColor={r.id === transformId ? 'table_accent' : 'none'}
                                        cursor='pointer'
                                    >
                                        <Td>{i+1}</Td>
                                        <Td>{r.id}</Td>
                                        <Td>{r.itemCode}</Td>
                                        <Td>{r.itemDescription}</Td>
                                        <Td>{r.uom}</Td>
                                        <Td>{r.batch}</Td>
                                        <Td>{r.version}</Td>
                                        <Td>{(r.quantity * r.batch).toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                                        <Td>{r.prodPlan}</Td>
                                        <Td>{r.addedBy}</Td>
                                        <Td><Button size='xs' colorScheme='red' onClick={() => cancelHandler(r.id)}>Cancel</Button></Td>
                                    </Tr>
                                )
                            }
                        </Tbody>
                    </Table>
                </PageScrollTransformation>
            </Flex>
            <Flex justifyContent='start' mt={1}>
                <Text fontSize='xs'>Number of entries: {requests?.length}</Text>
            </Flex>

            <CancelModal
                cancelId={cancelId}
                isOpen={isOpen}
                onClose={onClose}
                fetchRequests={fetchRequests}
                fetchRequirements={fetchRequirements}
                fetchNotification={fetchNotification}
            />

        </Flex >
    )
}


export const CancelModal = ({ cancelId, isOpen, onClose, fetchRequests, fetchRequirements, fetchNotification }) => {

    const [reasons, setReasons] = useState([])
    const [cancelRemarks, setCancelRemarks] = useState([])

    const toast = useToast()

    const fetchReasons = async () => {
        try {
            const res = await apiClient.get('Reason/GetAllActiveReason')
            setReasons(res.data)
        } catch (error) {
        }
    }

    useEffect(() => {
        try {
            fetchReasons()
        } catch (error) {
        }

        return () => {
            setReasons([])
        }
    }, []);

    const remarksHandler = (data) => {
        setCancelRemarks(data)
    }

    const submitCancelHandler = () => {
        if (cancelId) {
            try {
                const res = apiClient.put(`Planning/CancelTransformationRequest/${cancelId}`,
                    {
                        id: cancelId,
                        cancelRemarks: cancelRemarks
                    })
                    .then(res => {
                        ToastComponent("Success", `Item with Transformation ID of ${cancelId} has been cancelled.`, "success", toast)
                        fetchRequests()
                        fetchRequirements()
                        fetchNotification()
                        onClose()
                    })
                    .catch(err => {
                        ToastComponent("Error", "Cancel Failed", "error", toast)
                    })
            } catch (error) {
            }
        }
    }

    return (
        <Modal isCentered size='xl' isOpen={isOpen} onClose={() => { }}>
            <ModalOverlay />
            <ModalContent>

                <ModalHeader>
                    <Flex justifyContent='center' mt={10}>
                        <BsFillQuestionOctagonFill fontSize='50px' />
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />

                <ModalBody>
                    <VStack justifyContent='center' mb={8}>
                        <Text>Are you sure you want to reject this request?</Text>
                        {
                            reasons.length > 0 ? (
                                <Select
                                    onChange={(e) => remarksHandler(e.target.value)}
                                    placeholder='Please select a reason'
                                    w='65%'
                                    bgColor='#fff8dc'
                                >
                                    {
                                        reasons?.map((list, i) =>
                                            <option key={i} value={list.reasonName}>{list.reasonName}</option>
                                        )
                                    }
                                </Select>
                            ) : "Loading"
                        }
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} disabled={!cancelRemarks} onClick={submitCancelHandler}>
                        Yes
                    </Button>
                    <Button variant='ghost' onClick={onClose}>No</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
