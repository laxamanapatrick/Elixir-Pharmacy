import React, { useState } from 'react'
import { Button, ButtonGroup, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text, toast, useDisclosure, useToast, VStack } from '@chakra-ui/react'
import { BsPatchQuestionFill } from 'react-icons/bs'
import apiClient from '../../../services/apiClient'
import { ToastComponent } from '../../../components/Toast'
import { decodeUser } from '../../../services/decode-user'

const currentUser = decodeUser()

export const AddConfirmation = ({ isOpen, onClose, closeAddModal, details, setDetails, rawMatsInfo, setRawMatsInfo,
    customerRef, warehouseId, setSelectorId, setWarehouseId, fetchActiveMiscIssues, customerData, remarks, setRemarks, remarksRef }) => {

    const [isLoading, setIsLoading] = useState(false)

    const toast = useToast()

    const submitHandler = () => {
        setIsLoading(true)
        try {
            const addSubmit = {
                warehouseId: warehouseId,
                itemCode: rawMatsInfo.itemCode,
                itemDescription: rawMatsInfo.itemDescription,
                uom: rawMatsInfo.uom,
                customer: rawMatsInfo.customer,
                customerCode: customerData.customerCode,
                expirationDate: rawMatsInfo.expirationDate,
                quantity: rawMatsInfo.quantity,
                remarks: remarks,
                details: details,
                preparedBy: currentUser.fullName
            }
            const res = apiClient.post(`Miscellaneous/AddNewMiscellaneousIssueDetails`, addSubmit)
                .then(res => {
                    ToastComponent("Success", "Item added", "success", toast)
                    setRawMatsInfo({
                        itemCode: '',
                        itemDescription: '',
                        customer: rawMatsInfo.customer,
                        uom: '',
                        expirationDate: '',
                        quantity: ''
                    })
                    fetchActiveMiscIssues()
                    setWarehouseId('')
                    setIsLoading(false)
                    onClose()
                    closeAddModal()
                })
                .catch(err => {
                    ToastComponent("Error", "Item was not added", "error", toast)
                })
        } catch (error) {
        }

        // setRawMatsInfo({
        //     itemCode: '',
        //     itemDescription: '',
        //     customer: rawMatsInfo.customer,
        //     uom: '',
        //     expirationDate: '',
        //     quantity: ''
        // })
        // // customerRef.current.value = ''
        // setSelectorId('')
        // // setDetails('')
        // setIsLoading(false)
        // onClose()
        // closeAddModal()
    }

    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered size='xl'>
            <ModalContent bgColor='secondary' color='white' pt={10} pb={5}>
                <ModalHeader>
                    <Flex justifyContent='center'>
                        <BsPatchQuestionFill fontSize='50px' />
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />

                <ModalBody mb={5}>
                    <Text textAlign='center' fontSize='lg'>Are you sure you want to add this information?</Text>
                </ModalBody>

                <ModalFooter>
                    <ButtonGroup>
                        <Button onClick={submitHandler} isLoading={isLoading} colorScheme='blue'>Yes</Button>
                        <Button onClick={onClose} isLoading={isLoading} colorScheme='red'>No</Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export const SaveConfirmation = ({ isOpen, onClose, totalQuantity, details, customerData, setTotalQuantity,
    miscData, fetchActiveMiscIssues, isLoading, setIsLoading, customerRef, setDetails, setRawMatsInfo, setHideButton, remarks, setRemarks, remarksRef, transactionDate
}) => {

    const toast = useToast()

    const saveSubmitHandler = () => {

        if (totalQuantity > 0) {
            setIsLoading(true)
            try {
                const res = apiClient.post(`Miscellaneous/AddNewMiscellaneousIssue`, {
                    customerCode: customerData.customerCode,
                    customer: customerData.customer,
                    totalQuantity: totalQuantity,
                    preparedBy: currentUser.fullName,
                    remarks: remarks,
                    details: details,
                    transactionDate: transactionDate
                }
                )
                    .then(res => {
                        const issuePKey = res.data.id

                        //SECOND Update IF MAY ID
                        if (issuePKey) {
                            const arrayofId = miscData?.map(item => {
                                return {
                                    issuePKey: issuePKey,
                                    id: item.id
                                }
                            })
                            try {
                                const res = apiClient.put(`Miscellaneous/UpdateMiscellaneousIssuePKey`, arrayofId)
                                    .then(res => {
                                        fetchActiveMiscIssues()
                                        ToastComponent("Success", "Information saved", "success", toast)
                                        onClose()
                                        setTotalQuantity('')
                                        customerRef.current.value = ''
                                        remarksRef.current.value = ''
                                        setDetails('')
                                        setRawMatsInfo({
                                            itemCode: '',
                                            itemDescription: '',
                                            supplier: '',
                                            uom: '',
                                            expirationDate: '',
                                            quantity: ''
                                        })
                                        setHideButton(false)
                                    })
                            } catch (error) {
                                console.log(error)
                            }
                        }

                    })
                    setIsLoading(false)
                    .catch(err => {
                        ToastComponent("Error", "Information was not saved", "error", toast)
                        setIsLoading(false)
                    })
            } catch (error) {
            }
        }
    }

    const closeHandler = () => {
        setHideButton(false)
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered size='xl'>
            <ModalContent bgColor='secondary' color='white' pt={10} pb={5}>
                <ModalHeader>
                    <Flex justifyContent='center'>
                        <BsPatchQuestionFill fontSize='50px' />
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={closeHandler} />

                <ModalBody mb={5}>
                    <Text textAlign='center' fontSize='lg'>Are you sure you want to save this information?</Text>
                </ModalBody>

                <ModalFooter>
                    <ButtonGroup>
                        <Button onClick={saveSubmitHandler} isLoading={isLoading} disabled={isLoading} colorScheme='blue'>Yes</Button>
                        <Button onClick={closeHandler} isLoading={isLoading} colorScheme='red'>No</Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export const CancelConfirmation = ({ isOpen, onClose, selectorId, setSelectorId, fetchActiveMiscIssues, fetchExpiryDates }) => {

    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const cancelSubmitHandler = () => {
        setIsLoading(true)
        try {
            const res = apiClient.put(`Miscellaneous/CancelItemCodeInMiscellaneousIssue`, [{ id: selectorId }])
                .then(res => {
                    ToastComponent("Success", "Item has been cancelled", "success", toast)
                    fetchActiveMiscIssues()
                    fetchExpiryDates()
                    setIsLoading(false)
                    setSelectorId('')
                    onClose()
                })
                .catch(err => {
                    ToastComponent("Error", "Item was not cancelled", "error", toast)
                    setIsLoading(false)
                })
        } catch (error) {
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered size='xl'>
            <ModalContent bgColor='secondary' color='white' pt={10} pb={5}>
                <ModalHeader>
                    <Flex justifyContent='center'>
                        <BsPatchQuestionFill fontSize='50px' />
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />

                <ModalBody mb={5}>
                    <Text textAlign='center' fontSize='lg'>Are you sure you want to cancel this information?</Text>
                </ModalBody>

                <ModalFooter>
                    <ButtonGroup>
                        <Button onClick={cancelSubmitHandler} isLoading={isLoading} disabled={isLoading} colorScheme='blue'>Yes</Button>
                        <Button onClick={onClose} isLoading={isLoading} colorScheme='red'>No</Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export const AllCancelConfirmation = ({ isOpen, onClose, miscData, setSelectorId, fetchActiveMiscIssues, setHideButton, fetchExpiryDates }) => {

    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const allCancelSubmitHandler = () => {
        setIsLoading(true)
        const allId = miscData.map(item => {
            return {
                id: item.id
            }
        })
        try {
            const res = apiClient.put(`Miscellaneous/CancelItemCodeInMiscellaneousIssue`, allId)
                .then(res => {
                    ToastComponent("Success", "Items has been cancelled", "success", toast)
                    fetchActiveMiscIssues()
                    fetchExpiryDates()
                    setSelectorId('')
                    setHideButton(false)
                    setIsLoading(false)
                    onClose()
                })
                .catch(err => {
                    ToastComponent("Error", "Item was not cancelled", "error", toast)
                    setIsLoading(false)
                })
        } catch (error) {
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered size='xl'>
            <ModalContent bgColor='secondary' color='white' pt={10} pb={5}>
                <ModalHeader>
                    <Flex justifyContent='center'>
                        <BsPatchQuestionFill fontSize='50px' />
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />

                <ModalBody mb={5}>
                    <Text textAlign='center' fontSize='lg'>Are you sure you want to cancel all items in the list?</Text>
                </ModalBody>

                <ModalFooter>
                    <ButtonGroup>
                        <Button onClick={allCancelSubmitHandler} isLoading={isLoading} disabled={isLoading} colorScheme='blue'>Yes</Button>
                        <Button onClick={onClose} isLoading={isLoading} colorScheme='red'>No</Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}




        //Old submit
        // const firstSubmit = {
        //     customerCode: customerData.customerCode,
        //     customer: customerData.customer,
        //     totalQuantity: totalQuantity,
        //     remarks: listDataTempo[0]?.description,
        //     preparedBy: currentUser?.userName
        // }
        // if (totalQuantity > 0) {
        //     setIsLoading(true)
        //     try {
        //         const res = apiClient.post(`Miscellaneous/AddNewMiscellaneousIssue`, firstSubmit)
        //             .then(res => {
        //                 const id = res.data.id

        //                 //SECOND POST IF MAY ID
        //                 if (id) {
        //                     const submitArray = listDataTempo.map(item => {
        //                         return {
        //                             IssuePKey: id,
        //                             warehouseId: warehouseId,
        //                             itemCode: item.itemCode,
        //                             itemDescription: item.itemDescription,
        //                             uom: item.uom,
        //                             customer: item.supplier,
        //                             expirationdate: item.expirationDate,
        //                             quantity: item.quantity,
        //                             remarks: item.description,
        //                             preparedBy: currentUser.fullName
        //                         }
        //                     })
        //                     try {
        //                         const res = apiClient.post(`Miscellaneous/AddNewMiscellaneousIssueDetails`, submitArray)
        //                         ToastComponent("Success", "Information saved", "success", toast)
        //                         setListDataTempo([])
        //                         setIsLoading(false)
        //                         onClose()
        //                     } catch (error) {
        //                         console.log(error)
        //                     }
        //                     console.log(submitArray)
        //                 }

        //             })
        //             .catch(err => {
        //                 ToastComponent("Error", "Information was not saved", "error", toast)
        //                 setIsLoading(false)
        //             })
        //     } catch (error) {
        //     }
        // }
