//Status of Request

import React, { useState, useEffect, useRef } from 'react'
import {
  Button,
  Flex,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  VStack
} from '@chakra-ui/react'
import PageScrollTransformation from '../../../../components/PageScroll-Transformation'
import apiClient from '../../../../services/apiClient'
import { BsFillQuestionOctagonFill } from 'react-icons/bs'
import { ToastComponent } from '../../../../components/Toast'

// const fetchRequestByStatusApi = async (status) => {
//   const res = await apiClient.get(`Planning/GetAllPendingRequest?status=${status}`)
//   return res.data
// }

export const ListofRequest = ({ setTransformId, transformId, status, setStatus, fetchNotification }) => {

  const dropdownRef = useRef()

  const { isOpen: isCancel, onOpen: openCancel, onClose: closeCancel } = useDisclosure()

  const fetchRequestByStatusApi = async () => {
    if (status === 'approved') {
      const res = await apiClient.get(`Planning/GetAllApprovedTransformationRequest`)
      return res.data
    }
    if (status === 'cancelled') {
      const res = await apiClient.get(`Planning/GetAllCancelledTransformationRequest`)
      return res.data
    }
    if (status === 'rejected') {
      const res = await apiClient.get(`Planning/GetAllRejectRequest`)
      return res.data
    }
    if (status === 'pending') {
      const res = await apiClient.get(`Planning/GetAllPendingTransformationRequest`)
      return res.data
    }
  }

  const [requests, setRequests] = useState([])

  const fetchRequestByStatus = () => {
    fetchRequestByStatusApi(status).then(res => {
      setRequests(res)
    })
  }

  useEffect(() => {
    fetchRequestByStatus()
  }, [status])

  const statusHandler = (data) => {
    if (data) {
      setTransformId("")
      setStatus(data)
    } else {
      setStatus("")
    }
  }

  const requirementsHandler = (data) => {
    setTransformId(data)
  }

  return (
    <Flex w='90%' flexDirection='column' mt={3}>
      <Flex justifyContent='start' mb={3}>
        <HStack>
          <Text>STATUS:</Text>
          <Select
            onChange={(e) => statusHandler(e.target.value)}
            ref={dropdownRef}
            bgColor='#ffffe0' fontSize='sm'
          >
            <option value='pending'>PENDING</option>
            <option value='approved'>APPROVED</option>
            <option value='rejected'>REJECTED</option>
            <option value='cancelled'>CANCELLED</option>
          </Select>
        </HStack>
      </Flex>
      <Flex justifyContent='center' bgColor='secondary' p={1}>
        <Heading color='white' fontSize='l' fontWeight='semibold'>List of Request</Heading>
      </Flex>
      <Flex>
        <PageScrollTransformation minHeight='100px' maxHeight='270px'>
          <Table variant='simple' size='sm'>
            <Thead bgColor='secondary'>
              <Tr>
                <Th color='white'>Line</Th>
                <Th color='white'>Transform Id</Th>
                <Th color='white'>Item Code</Th>
                <Th color='white'>Item Description</Th>
                <Th color='white'>UOM</Th>
                <Th color='white'>Batch</Th>
                <Th color='white'>Version</Th>
                <Th color='white'>Quantity</Th>
                <Th color='white'>Prod Plan</Th>
                <Th color='white'>Request By</Th>
                {
                  status === 'approved' &&
                  <Th color='white'>Cancel</Th>
                }
              </Tr>
            </Thead>
            <Tbody>
              {
                requests?.map((r, i) =>
                  <Tr
                    key={i} onClick={() => requirementsHandler(r.id)}
                    bgColor={r.id === transformId ? 'table_accent' : 'none'}
                    cursor='pointer'
                  >
                    <Td>{i + 1}</Td>
                    <Td>{r.id}</Td>
                    <Td>{r.itemCode}</Td>
                    <Td>{r.itemDescription}</Td>
                    <Td>{r.uom}</Td>
                    <Td>{r.batch}</Td>
                    <Td>{r.version}</Td>
                    <Td>{r.quantity.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Td>
                    <Td>{r.prodPlan}</Td>
                    <Td>{r.addedBy}</Td>
                    {
                      status == 'approved' &&
                      <Td>
                        <Button
                          onClick={() => openCancel()}
                          size='xs' colorScheme='red'
                        >
                          Cancel
                        </Button>
                      </Td>
                    }
                  </Tr>
                )
              }
            </Tbody>
          </Table>
        </PageScrollTransformation>
      </Flex>
      <Flex justifyContent='start' mt={1}>
        <Text fontSize='xs'>Number of entries: {requests?.length}</Text>
      </Flex>

      {
        isCancel && (
          <CancelModal
            isOpen={isCancel}
            onClose={closeCancel}
            transformId={transformId}
            fetchRequestByStatus={fetchRequestByStatus}
            setStatus={setStatus}
            setTransformId={setTransformId}
            dropdownRef={dropdownRef}
            fetchNotification={fetchNotification}
          />
        )
      }

    </Flex>
  )
}

const CancelModal = ({ isOpen, onClose, transformId, fetchRequestByStatus, setStatus, setTransformId, dropdownRef, fetchNotification }) => {

  const [reasons, setReasons] = useState([])
  const [cancelRemarks, setCancelRemarks] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const toast = useToast()

  const fetchReasons = async () => {
    try {
      const res = await apiClient.get('Reason/GetAllActiveReason')
      setReasons(res.data)
    } catch (error) {
    }
  }

  useEffect(() => {
    try {
      fetchReasons()
    } catch (error) {
    }
  }, []);

  const remarksHandler = (data) => {
    setCancelRemarks(data)
  }

  const submitCancelHandler = () => {
    if (transformId) {
      setIsLoading(true)
      try {
        const res = apiClient.put(`Planning/CancelTransformationRequest/${transformId}`,
          {
            id: transformId,
            cancelRemarks: cancelRemarks
          })
          .then(res => {
            ToastComponent("Success", `Item with Transformation ID of ${transformId} has been cancelled.`, "success", toast)
            fetchRequestByStatus()
            setStatus("approved")
            setTransformId("")
            fetchNotification()
            dropdownRef.current.value = "approved"
            onClose()
          })
          .catch(err => {
            ToastComponent("Error", err.response.data, "error", toast)
          })
      } catch (error) {
      }
    }
  }

  return (
    <Modal isCentered size='xl' isOpen={isOpen} onClose={() => { }}>
      <ModalOverlay />
      <ModalContent>

        <ModalHeader>
          <Flex justifyContent='center' mt={10}>
            <BsFillQuestionOctagonFill fontSize='50px' />
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />

        <ModalBody>
          <VStack justifyContent='center' mb={8}>
            <Text>Are you sure you want to cancel this request?</Text>
            {
              reasons.length > 0 ? (
                <Select
                  onChange={(e) => remarksHandler(e.target.value)}
                  placeholder='Please select a reason'
                  w='65%'
                  bgColor='#fff8dc'
                >
                  {
                    reasons?.map((list, i) =>
                      <option key={i} value={list.reasonName}>{list.reasonName}</option>
                    )
                  }
                </Select>
              ) : "Loading"
            }
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} disabled={!cancelRemarks || isLoading}
            onClick={submitCancelHandler}
            isLoading={isLoading}
          >
            Yes
          </Button>
          <Button variant='ghost' onClick={onClose}>No</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )

}
