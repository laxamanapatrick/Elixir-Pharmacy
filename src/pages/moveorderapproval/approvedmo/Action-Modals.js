import React, { useState, useEffect } from 'react'
import { Button, ButtonGroup, Flex, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Select, Table, Tbody, Td, Text, Th, Thead, Tr, useToast, VStack } from '@chakra-ui/react'
import { BsQuestionOctagonFill } from 'react-icons/bs'
import apiClient from '../../../services/apiClient'
import { ToastComponent } from '../../../components/Toast'
import { decodeUser } from '../../../services/decode-user'
import '../../../theme/styles/stylesheets/stepper.css'
import PageScrollReusable from '../../../components/PageScroll-Reusable'

const currentUser = decodeUser()

export const RejectModal = ({ isOpen, onClose, id, fetchApprovedMO }) => {

    const [reasonSubmit, setReasonSubmit] = useState('')

    const [reasons, setReasons] = useState([])

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

    const submitHandler = () => {
        console.log(id, reasonSubmit)
        try {
            const res = apiClient.put(`Ordering/RejectListOfMoveOrder`,
                {
                    orderNo: id,
                    remarks: reasonSubmit,
                    rejectBy: currentUser?.userName
                }
            )
                .then(res => {
                    ToastComponent("Success", "Move order has been rejected", "success", toast)
                    fetchApprovedMO()
                    onClose()
                })
                .catch(err => {
                    ToastComponent("Error", "Move order was not rejected", "error", toast)
                })
        } catch (error) {
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered size='xl'>
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent='center'>
                        <Text>Reject</Text>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />

                <ModalBody>
                    <VStack justifyContent='center'>
                        <Text>Are you sure you want to reject this move order?</Text>
                        {
                            reasons?.length > 0 ?
                                <Select
                                    onChange={(e) => setReasonSubmit(e.target.value)}
                                    w='70%' placeholder='Please select a reason'
                                >
                                    {
                                        reasons?.map((reason, i) =>
                                            <option key={i} value={reason.reasonName}>{reason.reasonName}</option>
                                        )
                                    }
                                </Select>
                                : 'loading'
                        }
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <ButtonGroup size='sm' mt={7}>
                        <Button
                            onClick={submitHandler}
                            disabled={!reasonSubmit}
                            colorScheme='blue'
                        >
                            Yes
                        </Button>
                        <Button colorScheme='red' onClick={onClose}>No</Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export const TrackModal = ({ isOpen, onClose, trackData }) => {

    const TableHead = [
        "Line", "Barcode", "Item Code", "Item Description", "Quantity", "Expiration Date"
    ]

    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered size='5xl'>
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent='center'>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />

                <ModalBody>

                    <Flex>
                        <div className="tracker">
                            <div className="circle">
                                <div className={trackData[0]?.isPrepared ? "darkShape" : "lightShape"}>&nbsp;</div>
                                <div className="desc">Prepared</div>
                            </div>

                            <div className={trackData[0]?.isApproved ? "darkLine" : "lightLine"}></div>

                            <div className="circle">
                                <div className={trackData[0]?.isApproved ? "darkShape" : "lightShape"}>&nbsp;</div>
                                <div className="desc">Approved</div>
                            </div>

                            <div className={!trackData[0]?.isApproved ? "darkLine" : "lightLine"}></div>

                            <div className="circle">
                                <div className={!trackData[0]?.isPrepared ? "darkShape" : "lightShape"}>&nbsp;</div>
                                <div className="desc">Printing Move Order</div>
                            </div>

                            <div className={!trackData[0]?.isApproved ? "darkLine" : "lightLine"}></div>

                            <div className="circle">
                                <div className={!trackData[0]?.isPrepared ? "darkShape" : "lightShape"}>&nbsp;</div>
                                <div className="desc">Transact Move Order</div>
                            </div>
                        </div>
                    </Flex>

                    <Flex mt={8}>
                        <PageScrollReusable minHeight='150px' maxHeight='300px'>
                            <Table size='sm'>
                                <Thead bgColor='secondary'>
                                    <Tr>
                                        {TableHead?.map((head, i) => <Th color='white' key={i}>{head}</Th>)}
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {
                                        trackData?.map((item, i) =>
                                            <Tr key={i}>
                                                <Td>{i + 1}</Td>
                                                <Td>{item.barcodeNo}</Td>
                                                <Td>{item.itemCode}</Td>
                                                <Td>{item.itemDescription}</Td>
                                                <Td>{item.quantity}</Td>
                                                <Td>{item.expirationDate}</Td>
                                            </Tr>
                                        )
                                    }
                                </Tbody>
                            </Table>
                        </PageScrollReusable>
                    </Flex>

                </ModalBody>

                <ModalFooter>
                    <ButtonGroup size='sm' mt={7}>
                        <Button colorScheme='blackAlpha' onClick={onClose}>Close</Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}