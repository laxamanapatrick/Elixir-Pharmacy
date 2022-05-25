import React from 'react'
import {
    Button,
    ButtonGroup,
    Flex, Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Text,
    useDisclosure
} from '@chakra-ui/react'
import { BsFillQuestionOctagonFill } from 'react-icons/bs'

export const StartMixing = () => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const mixingModal = () => {
        onOpen()
    }

    return (
        <Flex w='full' justifyContent='end' bgColor='gray.200'>
            <Button colorScheme='green' px={6} size='sm' onClick={() => mixingModal()}>
                Start Mixing
            </Button>
            {
                isOpen && (
                    <StartMixingConfirmation
                        isOpen={isOpen}
                        onClose={onClose}
                    />
                )
            }
        </Flex>
    )
}

const StartMixingConfirmation = ({ isOpen, onClose }) => {

    return (
        <Modal size='xl' isCentered isOpen={isOpen} onClose={() => { }}>
            <ModalContent>

                <ModalHeader>
                    <Flex justifyContent='center'>
                        <BsFillQuestionOctagonFill fontSize='50px' />
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />

                <ModalBody>
                    <Flex justifyContent='center' mt={2}>
                        <Text>Are you sure you want to start mixing?</Text>
                    </Flex>
                </ModalBody>

                <ModalFooter>
                    <ButtonGroup size='md' mt={2}>
                        <Button colorScheme='blue'>Yes</Button>
                        <Button colorScheme='red' onClick={onClose}>No</Button>
                    </ButtonGroup>
                </ModalFooter>

            </ModalContent>
        </Modal>
    )
}
