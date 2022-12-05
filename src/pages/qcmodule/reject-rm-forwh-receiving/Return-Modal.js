import React, { useEffect, useState } from 'react';
import {
  Button,
  Select,
  Text,
  useToast,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ButtonGroup,
  Flex
} from '@chakra-ui/react';
import apiClient from '../../../services/apiClient';
import { decodeUser } from '../../../services/decode-user';
import { ToastComponent } from '../../../components/Toast';

const currentUser = decodeUser()

const ReturnModal = ({ qcReceivingId, fetchReject, isOpen, onClose, fetchNotification }) => {

  const [isLoading, setIsLoading] = useState(false)

  const toast = useToast()

  const submitHandler = () => {
    try {
      setIsLoading(true)
      const res = apiClient.put(`Receiving/WarehouseReturnRejectbyQc/${qcReceivingId}`,
        {
          id: qcReceivingId,
          rejectedBy: currentUser.fullName
        }
      ).then(res => {
        ToastComponent("Succes!", "Rejected Raw Material has been returned", "success", toast)
        fetchReject()
        fetchNotification()
        onClose()
      }).catch(err => {
        ToastComponent("Error!", err.response.data, "error", toast)
        setIsLoading(false)
      })
    } catch (error) {
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={() => { }} size='xl' isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <VStack>
            <Text>
              Return
            </Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody>
          <Flex justifyContent='center'>
            <Text>Are you sure you want to return this rejected raw material?</Text>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <ButtonGroup size='sm'>
            <Button
              onClick={() => submitHandler()}
              // isLoading={isLoading}
              // disabled={!Boolean(submitReason && submitRemarks)}
              colorScheme='blue'
              _hover={{ bgColor: 'accent', color: 'white' }}

            >
              Yes
            </Button>
            <Button
              onClick={onClose}
              // disabled={!Boolean(submitReason && submitRemarks)}
              colorScheme='red'
              _hover={{ bgColor: 'accent', color: 'white' }}

            >
              No
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal >
  )
}

export default ReturnModal
