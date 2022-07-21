import React, { useState } from 'react'
import { Button, ButtonGroup, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text } from '@chakra-ui/react'
import { BsPatchQuestionFill } from 'react-icons/bs'

export const AddConfirmation = ({ isOpen, onClose, closeAddModal, details, setDetails, rawMatsInfo, setRawMatsInfo,
  listDataTempo, setListDataTempo, customerRef, setSelectorId }) => {

  const [isLoading, setIsLoading] = useState(false)

  const submitHandler = () => {
    setIsLoading(true)
    const addToArray = {
      "itemCode": rawMatsInfo.itemCode,
      "customer": rawMatsInfo.customer,
      "uom": rawMatsInfo.uom,
      "expirationDate": rawMatsInfo.expirationDate,
      "quantity": rawMatsInfo.quantity,
      "description": details
    }
    setListDataTempo(current => [...current, addToArray])
    setRawMatsInfo({
      itemCode: '',
      customer: '',
      uom: '',
      expirationDate: '',
      quantity: ''
    })
    customerRef.current.value = ''
    setSelectorId('')
    setDetails('')
    setIsLoading(false)
    onClose()
    closeAddModal()
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

export const EditModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={() => { }} isCentered size='4xl'>
      <ModalContent>
        <ModalHeader></ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody></ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export const EditConfirmation = ({ isOpen, onClose }) => {
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
          <Text textAlign='center' fontSize='lg'>Are you sure you want to update this information?</Text>
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export const SaveConfirmation = ({ isOpen, onClose }) => {
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
          <Text textAlign='center' fontSize='lg'>Are you sure you want to save this information?</Text>
        </ModalBody>

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export const CancelConfirmation = ({ isOpen, onClose }) => {
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

        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  )
}