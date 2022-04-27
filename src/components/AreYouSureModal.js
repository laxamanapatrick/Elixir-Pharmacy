import React from 'react'
import {
  Button,
  ButtonGroup,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import { BsFillQuestionOctagonFill } from 'react-icons/bs'

const AreYouSureModal = ({ action, loading }) => {

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Modal isOpen={isOpen} onClose={() => { }} isCentered size='xl'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex justifyContent='center' mt={10}>
            <BsFillQuestionOctagonFill fontSize='50px' />
          </Flex>

        </ModalHeader>
        <ModalCloseButton onClick={onClose} />
        <ModalBody>
          <Flex justifyContent='center'>
            <Text>Are you sure you want to do this action?</Text>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup size='md'>
            <Button
              colorScheme='blue' _hover={{ bgColor: 'accent' }}
              isLoading={loading}
              onClick={action}
            >
              Yes
            </Button>
            <Button onClick={onClose}>No</Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default AreYouSureModal