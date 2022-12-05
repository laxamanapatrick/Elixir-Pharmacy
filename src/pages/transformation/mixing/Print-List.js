import React, { useRef, useState } from 'react'
import {
  Button,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
  VStack,
  Box,
  ButtonGroup
} from '@chakra-ui/react'
import { BsQuestionOctagon } from 'react-icons/bs'
import moment from 'moment'
import { useReactToPrint } from 'react-to-print'
import Barcode from 'react-barcode';
import { ToastComponent } from '../../../components/Toast'
import apiClient from '../../../services/apiClient';
import { decodeUser } from '../../../services/decode-user'

const currentUser = decodeUser()

export const SaveConfirmation = ({ isOpen,
  onClose,
  closeSaveModal,
  transformId,
  lotCategory,
  expirationDate,
  batchRemaining,
  fetchMixingRequest,
  fetchRequirements,
  fetchBatchRemaining,
  setMixingCue,
  valueRef,
  setDisableSave,
  requests,
  totalWeight,
  setTotalWeight,
  setCurrentPage,
  fetchNotification
}) => {

  const [displayData, setDisplayData] = useState([])
  const toast = useToast()

  const [isLoading, setIsLoading] = useState(false)

  const { isOpen: isPrint, onOpen: openPrint, onClose: closePrint } = useDisclosure()

  const date = new Date()
  const newDate = new Date(date.setMonth(date.getMonth() + 6))

  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const newDisplayData = {
    "Date": displayData?.['Date'],
    "Transform ID": displayData?.['Transform ID'],
    "Item Code": displayData?.['Item Code'],
    "Item Description": displayData?.['Item Description'],
    "UOM": displayData?.['UOM'],
    "Batch": displayData?.['Batch'],
    "Quantity": displayData?.['Quantity'],
    "Mixing Date": displayData?.['Mixing Date'],
    "Expiration Date": displayData?.['Expiration Date'],
    "Lot Name": displayData?.['Lot Name'],
  }

  const submitHandler = () => {
    setIsLoading(true)
    try {
      const res = apiClient.put(`Preparation/FinishedMixedMaterialsForWarehouse/${transformId}`, {
        transformId: transformId,
        expiration: expirationDate,
        lotCategory: lotCategory,
        receivedBy: currentUser.fullName,
      })
        .then(res => {
          ToastComponent('Success', 'Mixing has started', 'success', toast)
          const displayData = {
            "Date": moment(new Date()).format('MM/DD/yyyy, h:mm:ss a'),
            "Transform ID": transformId,
            "Item Code": requests?.mixing[0]?.itemCode,
            "Item Description": requests?.mixing[0]?.itemDescription,
            "UOM": requests?.mixing[0]?.uom,
            "Batch": `${res.data.batchCount} out of ${requests?.mixing[0]?.batch}`,
            "Quantity": totalWeight && totalWeight,
            "Mixing Date": moment(new Date()).format('MM/DD/yyyy'),
            "Expiration Date": newDate && moment(newDate).format('MM/DD/yyyy'),
            "Lot Name": lotCategory && lotCategory,
          }
          setDisplayData(displayData)
          setTotalWeight('')
          fetchMixingRequest()
          fetchRequirements()
          fetchBatchRemaining()
          fetchNotification()
          setIsLoading(false)
          setDisableSave(true)
          if (batchRemaining === 0) {
            setMixingCue(false)
          }
          // valueRef.current.value = null
          handlePrint()
          openPrint()
        })
        .catch(err => {
          ToastComponent('Error', err.response.data, 'error', toast)
          setIsLoading(false)
        })
    } catch (error) {
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => { }} isCentered size='xl'>
        <ModalContent>
          <ModalHeader mt={10}>
            <Flex justifyContent='center'>
              <BsQuestionOctagon fontSize='50px' />
            </Flex>
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />

          <ModalBody mb={10}>
            <Box w='20%' display='none'>

              <VStack spacing={0} justifyContent='center' ref={componentRef}>

                <VStack spacing={0} justifyContent='start'>
                  <Image
                    src='/images/RDF Logo.png'
                    w='20%' ml={3}
                  />
                  <Text fontSize='xs' ml={2}>Purok 6, Brgy. Lara, City of San Fernando, Pampanga, Philippines</Text>
                </VStack>

                <Flex mt={2} w='90%' justifyContent='center'>
                  <Text fontSize='25px' fontWeight='semibold' ml={4}>Raw Materials</Text>
                </Flex>

                {Object.keys(newDisplayData)?.map((key, i) =>
                  <Flex w='full' justifyContent='center' key={i}>
                    <Flex ml='10%' w='full'>
                      <Flex>
                        <Text fontWeight='semibold' fontSize='10px'>{key}:</Text>
                      </Flex>
                    </Flex>
                    <Flex w='full'>
                      <Flex>
                        <Text fontWeight='semibold' fontSize='10px'>{newDisplayData[key]}</Text>
                      </Flex>
                    </Flex>
                  </Flex>
                )}

                <VStack spacing={0} w='90%' ml={4} justifyContent='center'>
                  <Barcode width={3} height={75} value={newDisplayData?.['Transform ID']} />
                </VStack>

                <Flex w='full'></Flex>

              </VStack>

            </Box>
            <Flex justifyContent='center'>
              <Text fontSize='lg'>Are you sure you want to save?</Text>
            </Flex>
          </ModalBody>

          <ModalFooter mt={5}>
            <ButtonGroup size='sm' mt={4}>
              <Button
                onClick={submitHandler}
                disabled={!lotCategory || !expirationDate || isLoading}
                isLoading={isLoading}
                colorScheme='blue'
              >
                Yes
              </Button>
              <Button
                disabled={isLoading}
                isLoading={isLoading}
                colorScheme='red' onClick={onClose}
              >
                No
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {
        isPrint && (
          <PrintList
            isOpen={isPrint}
            onClose={closePrint}
            closeSave={closeSaveModal}
            requests={requests}
            newDisplayData={newDisplayData}
            valueRef={valueRef}
            fetchMixingRequest={fetchMixingRequest}
            fetchRequirements={fetchRequirements}
            fetchBatchRemaining={fetchBatchRemaining}
            setDisableSave={setDisableSave}
            batchRemaining={batchRemaining}
            setMixingCue={setMixingCue}
            setCurrentPage={setCurrentPage}
          />
        )
      }
    </>
  )
}

export const PrintList = ({ isOpen, onClose, closeSave, newDisplayData, valueRef, batchRemaining,
  setMixingCue, setDisableSave, setCurrentPage,
  fetchMixingRequest, fetchRequirements, fetchBatchRemaining }) => {

  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const closeHandler = () => {
    onClose()
    closeSave()
    if (batchRemaining === 0) {
      setCurrentPage(1)
      fetchMixingRequest()
      fetchRequirements()
      fetchBatchRemaining()
      setMixingCue(false)
    }
    window.setTimeout(() => {
      valueRef?.current?.focus()
    }, 500)
  }

  return (
    <Modal isOpen={isOpen} onClose={() => { }} isCentered size='md'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex justifyContent='center'>
            <Text>Raw Materials</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={closeHandler} />

        <ModalBody>
          <VStack spacing={0} justifyContent='center' ref={componentRef}>

            <VStack spacing={0} justifyContent='start'>
              <Image
                src='/images/RDF Logo.png'
                w='20%' ml={3}
              />
              <Text fontSize='xs' ml={2}>Purok 6, Brgy. Lara, City of San Fernando, Pampanga, Philippines</Text>
            </VStack>

            <Flex justifyContent='center'>
              <Text fontSize='xs' fontWeight='semibold'>(reprinted copy)</Text>
            </Flex>

            <Flex mt={2} w='90%' justifyContent='center'>
              <Text fontSize='25px' fontWeight='semibold' ml={4}>Raw Materials</Text>
            </Flex>

            {Object.keys(newDisplayData)?.map((key, i) =>
              <Flex w='full' justifyContent='center' key={i}>
                <Flex ml='4%' w='full'>
                  <Flex>
                    <Text fontWeight='semibold' fontSize='10px'>{key}:</Text>
                  </Flex>
                </Flex>
                <Flex w='full'>
                  <Flex>
                    <Text fontWeight='semibold' fontSize='10px'>{newDisplayData[key]}</Text>
                  </Flex>
                </Flex>
              </Flex>
            )}

            <VStack spacing={0} w='90%' ml={4} justifyContent='center'>
              <Barcode width={3} height={75} value={newDisplayData?.['Transform ID']} />
            </VStack>

            <Flex w='full'></Flex>

          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' onClick={handlePrint}>Re-Print</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
