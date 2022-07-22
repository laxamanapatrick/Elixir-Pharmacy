import React, { useState } from 'react'
import { Button, ButtonGroup, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { BsPatchQuestionFill } from 'react-icons/bs'
import apiClient from '../../../services/apiClient'
import { ToastComponent } from '../../../components/Toast'
import { decodeUser } from '../../../services/decode-user'

const currentUser = decodeUser()

export const AddConfirmation = ({ isOpen, onClose, closeAddModal, details, setDetails, rawMatsInfo, setRawMatsInfo,
  listDataTempo, setListDataTempo, supplierRef, setSelectorId }) => {

  const [isLoading, setIsLoading] = useState(false)

  const addItemHandler = () => {
    setIsLoading(true)
    const addToArray = {
      "itemCode": rawMatsInfo.itemCode,
      "itemDescription": rawMatsInfo.itemDescription,
      "supplier": rawMatsInfo.supplier,
      "uom": rawMatsInfo.uom,
      "expirationDate": rawMatsInfo.expirationDate,
      "quantity": rawMatsInfo.quantity,
      "description": details
    }
    setListDataTempo(current => [...current, addToArray])
    setRawMatsInfo({
      itemCode: '',
      itemDescription: '',
      supplier: '',
      uom: '',
      expirationDate: '',
      quantity: ''
    })
    supplierRef.current.value = ''
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
            <Button
              onClick={addItemHandler}
              isLoading={isLoading}
              colorScheme='blue'
            >
              Yes
            </Button>
            <Button onClick={onClose} isLoading={isLoading} colorScheme='red'>No</Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export const SaveConfirmation = ({ isOpen, onClose, listDataTempo, setListDataTempo }) => {

  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const saveSubmitHandler = () => {
    const submitArray = listDataTempo.map(item => {
      return {
        itemCode: item.itemCode,
        itemDescription: item.itemDescription,
        uom: item.uom,
        supplier: item.supplier,
        expirationDate: item.expirationDate,
        quantity: item.quantity,
        remarks: item.description,
        preparedBy: currentUser.userName
      }
    })
    setIsLoading(true)
    try {
      const res = apiClient.post(`Miscellaneous/AddNewMiscellaneousReceipt`, submitArray)
        .then(res => {
          ToastComponent("Success", "Information saved", "success", toast)
          setListDataTempo([])
          onClose()
        })
        .catch(err => {
          ToastComponent("Error", "Information was not saved", "error", toast)
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
          <Text textAlign='center' fontSize='lg'>Are you sure you want to save this information?</Text>
        </ModalBody>

        <ModalFooter>
          <ButtonGroup>
            <Button onClick={saveSubmitHandler} isLoading={isLoading} disabled={isLoading} colorScheme='blue'>Yes</Button>
            <Button onClick={onClose} isLoading={isLoading} colorScheme='red'>No</Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export const CancelConfirmation = ({ isOpen, onClose, selectorId, rowIndex, setListDataTempo, listDataTempo }) => {

  const [isLoading, setIsLoading] = useState(false)

  const cancelSubmitHandler = () => {
    setIsLoading(true)
    if (listDataTempo.length > 0) {
      const newArray = [...listDataTempo]
      if (rowIndex !== -1) {
        newArray.splice(rowIndex, 1)
        setListDataTempo(newArray)
        onClose()
      }
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

// Frontend Edit Process

export const EditModal = ({ isOpen, onClose, selectorId, rowIndex, setListDataTempo, listDataTempo }) => {

  const [isLoading, setIsLoading] = useState(false)
  const { isOpen: isEditConfirm, onClose: closeEditConfirm, onOpen: openEditConfirm } = useDisclosure()

  const editHandler = () => {
    openEditConfirm()
  }

  return (
    <Modal isOpen={isOpen} onClose={() => { }} isCentered size='4xl'>
      <ModalContent>
        <ModalHeader></ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody></ModalBody>

        <ModalFooter>
          <ButtonGroup>
            <Button onClick={editHandler} isLoading={isLoading} disabled={isLoading} colorScheme='blue'>Update</Button>
            <Button onClick={onClose} isLoading={isLoading} colorScheme='red'>No</Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
      {
        isEditConfirm && (
          <EditConfirmation
            isOpen={isEditConfirm}
            onClose={closeEditConfirm}
            closeEditModal={onClose}
            selectorId={selectorId}
            rowIndex={rowIndex}
            setListDataTempo={setListDataTempo}
            listDataTempo={listDataTempo}
          />
        )
      }
    </Modal>
  )
}

export const EditConfirmation = ({ isOpen, onClose, selectorId, rowIndex, setListDataTempo, listDataTempo }) => {
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

        <ModalFooter>
          <ButtonGroup>
            {/* <Button onClick={saveSubmitHandler} isLoading={isLoading} disabled={isLoading} colorScheme='blue'>Yes</Button> */}
            {/* <Button onClick={onClose} isLoading={isLoading} colorScheme='red'>No</Button> */}
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}