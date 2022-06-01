import React from 'react'
import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { BsFillQuestionOctagonFill } from 'react-icons/bs'
import apiClient from '../../../services/apiClient'
import { ToastComponent } from '../../../components/Toast'

export const SaveButton = ({ transformId, itemCode, weight, fetchRequirements, fetchRequirementsInformation, setItemCode, setWeight, disableSave }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <Flex w='full' justifyContent='center'>
                <Button size='sm' colorScheme='blue' w='90%' mb={3} disabled={disableSave} onClick={() => onOpen()}>SAVE</Button>
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
                    />
                )
            }
        </>
    )
}

const SaveModal = ({ isOpen, onClose, transformId, itemCode, weight, fetchRequirements, fetchRequirementsInformation, setItemCode, setWeight }) => {

    const toast = useToast()

    const submitHandler = () => {
        try {
            const res = apiClient.put(`Preparation/PrepareMaterialsForRequest/${transformId}`, {
                transformId: transformId,
                itemCode: itemCode,
                weighingScale: weight
            })
                .then(res => {
                    ToastComponent("Succes", "Ayun pumasok", "success", toast)
                    setWeight(null)
                    setItemCode('')
                    fetchRequirements()
                    fetchRequirementsInformation()
                    onClose()
                })
                .catch(err => {
                    ToastComponent("Error", "Di pumasok", "error", toast)
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
                    >
                        Yes
                    </Button>
                    <Button colorScheme='red' _hover={{ color: 'none', bgColor: 'none' }} color='white' onClick={onClose}>No</Button>
                </ModalFooter>

            </ModalContent>
        </Modal>
    )
}
