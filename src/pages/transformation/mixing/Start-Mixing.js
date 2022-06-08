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
    useDisclosure,
    useToast
} from '@chakra-ui/react'
import { BsFillQuestionOctagonFill } from 'react-icons/bs'
import apiClient from '../../../services/apiClient'
import { ToastComponent } from '../../../components/Toast'

export const StartMixing = ({ setMixingCue, mixingCue, transformId }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const mixingModal = () => {
        onOpen()
    }

    return (
        <Flex w='full' justifyContent='end' bgColor='gray.200'>
            {
                    mixingCue === true ?
                    <Button colorScheme='red' px={6} size='sm' onClick={() => setMixingCue(false)}>
                        Stop Mixing
                    </Button>
                    :
                    <Button colorScheme='green' px={6} size='sm' disabled={!transformId} onClick={() => mixingModal()}>
                        Start Mixing
                    </Button>
            }
            {
                isOpen && (
                    <MixingConfirmation
                        isOpen={isOpen}
                        onClose={onClose}
                        setMixingCue={setMixingCue}
                    />
                )
            }
        </Flex>
    )
}

const MixingConfirmation = ({ isOpen, onClose, setMixingCue }) => {

    const toast = useToast()

    const mixingHandler = () => {
        setMixingCue(true)
        onClose()
    }

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
                        <Button colorScheme='blue' onClick={() => mixingHandler()}>Yes</Button>
                        <Button colorScheme='red' onClick={onClose}>No</Button>
                    </ButtonGroup>
                </ModalFooter>

            </ModalContent>
        </Modal>
    )
}
