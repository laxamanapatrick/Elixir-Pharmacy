import React from 'react'
import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text, useDisclosure } from '@chakra-ui/react'
import { BsFillQuestionOctagonFill } from 'react-icons/bs'

export const SaveButton = () => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <Flex w='full' justifyContent='center'>
                <Button size='sm' colorScheme='blue' w='90%' mb={3} onClick={() => onOpen()}>SAVE</Button>
            </Flex>
            {
                isOpen && (
                    <SaveModal
                        isOpen={isOpen}
                        onClose={onClose}
                    />
                )
            }
        </>
    )
}

const SaveModal = ({ isOpen, onClose }) => {
    return (
        <Modal isCentered size='xl' isOpen={isOpen} onClose={() => { }}>
            <ModalContent bgColor='primary'>
                <ModalHeader>
                    <Flex justifyContent='center' mt={10}>
                        <BsFillQuestionOctagonFill  color='white' fontSize='50px' />
                    </Flex>
                </ModalHeader>
                <ModalCloseButton color='white' onClick={onClose} />
                <ModalBody>
                    <Flex justifyContent='center'>
                        <Text color='white'>Are you sure you want to save this preparation?</Text>
                    </Flex>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3}>
                        Yes
                    </Button>
                    <Button colorScheme='red' _hover={{color: 'none', bgColor:'none'}} color='white' onClick={onClose}>No</Button>
                </ModalFooter>

            </ModalContent>
        </Modal>
    )
}
