import React, { useRef } from 'react'
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
  VStack
} from '@chakra-ui/react'
import Barcode from 'react-barcode'
import { useReactToPrint } from 'react-to-print'

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
