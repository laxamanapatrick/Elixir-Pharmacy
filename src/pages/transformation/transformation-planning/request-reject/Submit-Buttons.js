import React from 'react'
import { Button, ButtonGroup, Flex, useDisclosure } from '@chakra-ui/react'
import EditModalReject from './Edit-Modal-Reject'
import CancelSubmit from './Cancel-Submit'
import RequestRejectSubmit from './Request-Reject-Submit'

const SubmitButtons = ({ transformId, setTransformId, rejects, fetchRejected, fetchRequirements, editData, fetchNotification }) => {
    
    const { isOpen: isRequestOpen, onOpen: openRequest, onClose: closeRequest } = useDisclosure()
    const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure()
    const { isOpen: isCancelOpen, onOpen: openCancel, onClose: closeCancel } = useDisclosure()

    const requestHandler = () => {
        openRequest()
    }

    const editHandler = (data) => {
        openEdit()
    }

    const cancelHandler = () => {
        openCancel()
    }

    return (
        <Flex justifyContent='end' w='90%' bgColor='gray.200'>
            <ButtonGroup size='xs'>
                {/* <Button colorScheme='green' disabled={!transformId} onClick={requestHandler}>REQUEST</Button> */}
                <Button px={5} colorScheme='blue' disabled={!transformId} color='white' onClick={editHandler}>EDIT</Button>
                <Button colorScheme='red' disabled={!transformId} onClick={cancelHandler}>CANCEL</Button>
            </ButtonGroup>

            {
                isRequestOpen && (
                    <RequestRejectSubmit
                        isOpen={isRequestOpen}
                        onClose={closeRequest}
                        transformId={transformId}
                        fetchRejected={fetchRejected}
                        fetchRequirements={fetchRequirements}
                        setTransformId={setTransformId}
                        fetchNotification={fetchNotification}
                    />
                )
            }

            {
                isEditOpen && (
                    <EditModalReject
                        isOpen={isEditOpen}
                        onClose={closeEdit}
                        transformId={transformId}
                        setTransformId={setTransformId}
                        rejects={rejects}
                        fetchRejected={fetchRejected}
                        fetchRequirements={fetchRequirements}
                        editData={editData}
                        fetchNotification={fetchNotification}
                    />
                )
            }

            {
                isCancelOpen && (
                    <CancelSubmit
                        isOpen={isCancelOpen}
                        onClose={closeCancel}
                        transformId={transformId}
                        fetchRejected={fetchRejected}
                        fetchRequirements={fetchRequirements}
                        setTransformId={setTransformId}
                        fetchNotification={fetchNotification}
                    />
                )
            }

        </Flex>
    )
}

export default SubmitButtons