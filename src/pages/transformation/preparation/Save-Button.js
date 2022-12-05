import React, { useEffect, useState } from 'react'
import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { BsFillQuestionOctagonFill } from 'react-icons/bs'
import apiClient from '../../../services/apiClient'
import { ToastComponent } from '../../../components/Toast'
import { decodeUser } from '../../../services/decode-user'

const currentUser = decodeUser()

export const SaveButton = ({ transformId, itemCode, weight, fetchRequirements,
    fetchRequirementsInformation, setItemCode, setWeight, disableSave,
    weightRef, fetchInformation, setCurrentPage, requirements, setDisableSave, fetchNotification }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    // useEffect(() => {
    //     if (weightRef.current) {
    //         weightRef.current.focus()
    //     }
    // }, [weightRef])

    return (
        <>
            <Flex w='full' justifyContent='center'>
                <Button
                    onClick={() => onOpen()}
                    disabled={disableSave || !weight || requirements.length === 0}
                    title={disableSave ? 'Weight must meet the required quantity variance' : 'Prepare this quantity'}
                    size='sm' colorScheme='blue' w='90%' mb={3}
                >
                    SAVE
                </Button>
            </Flex>
            {
                isOpen && (
                    <SaveModal
                        isOpen={isOpen}
                        onClose={onClose}
                        transformId={transformId}
                        itemCode={itemCode}
                        weight={weight}
                        setItemCode={setItemCode}
                        setWeight={setWeight}
                        fetchRequirements={fetchRequirements}
                        fetchRequirementsInformation={fetchRequirementsInformation}
                        fetchInformation={fetchInformation}
                        weightRef={weightRef}
                        setCurrentPage={setCurrentPage}
                        requirements={requirements}
                        setDisableSave={setDisableSave}
                        fetchNotification={fetchNotification}
                    />
                )
            }
        </>
    )
}

const SaveModal = ({ isOpen, onClose, transformId, itemCode, weight, fetchRequirements,
    fetchRequirementsInformation, setItemCode, setWeight, weightRef, fetchInformation,
    setCurrentPage, requirements, setDisableSave, fetchNotification }) => {

    const toast = useToast()
    const [isLoading, setIsLoading] = useState(false)

    const submitHandler = () => {
        setIsLoading(true)
        try {
            const res = apiClient.put(`Preparation/PrepareMaterialsForRequest/${transformId}`, {
                transformId: transformId,
                itemCode: itemCode,
                weighingScale: parseFloat(weight),
                preparedBy: currentUser.fullName
            })
                .then(res => {
                    if (requirements.length === 1) {
                        ToastComponent("Succes", "Requirement has been prepared", "success", toast)
                        setWeight('')
                        setItemCode('')
                        setDisableSave(true)
                        fetchRequirements()
                        fetchRequirementsInformation()
                        fetchInformation()
                        fetchNotification()
                        // weightRef.current.value = ''
                        // window.setTimeout(() => {
                        //     weightRef.current.focus()
                        // }, 3000)
                        setCurrentPage(1)
                        setIsLoading(false)
                        onClose()
                    } else {
                        ToastComponent("Succes", "Requirement has been prepared", "success", toast)
                        setWeight('')
                        setItemCode('')
                        setDisableSave(true)
                        fetchRequirements()
                        fetchRequirementsInformation()
                        fetchInformation()
                        fetchNotification()
                        setIsLoading(false)
                        // weightRef.current.value = ''
                        // window.setTimeout(() => {
                        //     weightRef.current.focus()
                        // }, 3000)
                        onClose()
                    }
                })
                .catch(err => {
                    ToastComponent("Error", err.response.data, "error", toast)
                    setIsLoading(false)
                })
        } catch (error) {
        }
    }

    return (
        <Modal isCentered size='xl' isOpen={isOpen} onClose={() => { }}>
            <ModalContent bgColor='primary'>
                <ModalHeader>
                    <Flex justifyContent='center' mt={10}>
                        <BsFillQuestionOctagonFill color='white' fontSize='50px' />
                    </Flex>
                </ModalHeader>
                <ModalCloseButton color='white' onClick={onClose} />
                <ModalBody>
                    <Flex justifyContent='center'>
                        <Text color='white'>Are you sure you want to save this preparation?</Text>
                    </Flex>
                </ModalBody>

                <ModalFooter>
                    <Button
                        onClick={() => submitHandler()}
                        colorScheme='blue' mr={3}
                        isLoading={isLoading}
                        disabled={isLoading}
                    >
                        Yes
                    </Button>
                    <Button
                        isLoading={isLoading}
                        disabled={isLoading}
                        colorScheme='red' _hover={{ color: 'none', bgColor: 'none' }} color='white' onClick={onClose}
                    >
                        No
                    </Button>
                </ModalFooter>

            </ModalContent>
        </Modal>
    )
}
