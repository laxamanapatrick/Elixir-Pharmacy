import React from 'react'
import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, VStack } from '@chakra-ui/react'
import { BsFillQuestionOctagonFill } from 'react-icons/bs'

const Ask = ({ isOpen, onClose, onCloseEditModal, fetchFormula }) => {


    const closeSubmit = () => {
        fetchFormula()
        onClose()
        onCloseEditModal()
    }

    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent='center' mt={10}>
                        <VStack>
                            <BsFillQuestionOctagonFill fontSize='50px' />
                            <Text>Are you sure you want to exit?</Text>
                        </VStack>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />
                <ModalBody>
                    <VStack spacing={0} justifyContent='center'>
                        <Text color='danger'>Some requirements were removed.</Text>
                        <Text color='danger'>Quantity needed is not met.</Text>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={closeSubmit}>
                        Yes
                    </Button>
                    <Button variant='ghost' onClick={onClose}>No</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default Ask