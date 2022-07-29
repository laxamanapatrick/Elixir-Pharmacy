import React, { useState } from 'react'
import { Button, ButtonGroup, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { BsPatchQuestionFill } from 'react-icons/bs'
import apiClient from '../../../services/apiClient'
import { ToastComponent } from '../../../components/Toast'
import { decodeUser } from '../../../services/decode-user'

const currentUser = decodeUser()

export const AddConfirmation = ({ isOpen, onClose, closeAddModal, details, setDetails, rawMatsInfo, setRawMatsInfo,
  listDataTempo, setListDataTempo, customerRef, setSelectorId }) => {

  const [isLoading, setIsLoading] = useState(false)

  const submitHandler = () => {
    setIsLoading(true)
    const addToArray = {
      "itemCode": rawMatsInfo.itemCode,
      "itemDescription": rawMatsInfo.itemDescription,
      "customer": rawMatsInfo.customer,
      "uom": rawMatsInfo.uom,
      "expirationDate": rawMatsInfo.expirationDate,
      "quantity": rawMatsInfo.quantity,
      "description": details
    }
  
    setListDataTempo(current => [...current, addToArray])
    setRawMatsInfo({
      itemCode: '',
      itemDescription: '',
      customer: rawMatsInfo.customer,
      uom: '',
      expirationDate: '',
      quantity: ''
    })
    // customerRef.current.value = ''
    setSelectorId('')
    // setDetails('')
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

export const SaveConfirmation = ({ isOpen, onClose, listDataTempo, setListDataTempo, customerData, totalQuantity, warehouseId }) => {

  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const saveSubmitHandler = () => {

    const firstSubmit = {
      customerCode: customerData.customerCode,
      customer: customerData.customer,
      totalQuantity: totalQuantity,
      remarks: listDataTempo[0]?.description,
      preparedBy: currentUser?.userName
    }

    if (totalQuantity > 0) {
      setIsLoading(true)
      try {
        const res = apiClient.post(`Miscellaneous/AddNewMiscellaneousIssue`, firstSubmit)
          .then(res => {
            const id = res.data.id

            //SECOND POST IF MAY ID
            if (id) {
              const submitArray = listDataTempo.map(item => {
                return {
                  IssuePKey: id,
                  warehouseId: warehouseId,
                  itemCode: item.itemCode,
                  itemDescription: item.itemDescription,
                  uom: item.uom,
                  customer: item.supplier,
                  expirationdate: item.expirationDate,
                  quantity: item.quantity,
                  remarks: item.description,
                  preparedBy: currentUser.userName
                }
              })
              try {
                const res = apiClient.post(`Miscellaneous/AddNewMiscellaneousIssueDetails`, submitArray)
                ToastComponent("Success", "Information saved", "success", toast)
                setListDataTempo([])
                setIsLoading(false)
                onClose()
              } catch (error) {
                console.log(error)
              }
              console.log(submitArray)
            }

          })
          .catch(err => {
            ToastComponent("Error", "Information was not saved", "error", toast)
            setIsLoading(false)
          })
      } catch (error) {
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
