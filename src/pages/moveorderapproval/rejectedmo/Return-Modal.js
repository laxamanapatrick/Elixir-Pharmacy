import React, { useState, useEffect } from 'react'
import { Button, ButtonGroup, Flex, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Select, Text, useToast, VStack } from '@chakra-ui/react'
import { BsQuestionOctagonFill } from 'react-icons/bs'
import apiClient from '../../../services/apiClient'
import { ToastComponent } from '../../../components/Toast'
import { decodeUser } from '../../../services/decode-user'

const currentUser = decodeUser()

export const ReturnModal = ({ isOpen, onClose }) => {

    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered size='xl'>
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent='center'>
                        <BsQuestionOctagonFill fontSize='40px' />
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />

                <ModalBody>
                    <VStack justifyContent='center'>
                        <Text textAlign='center'>Are you sure you want to return this item?</Text>
                        {/* {
                            reasonData.length > 0 ?
                                <Select
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder='Please select a reason'
                                    bgColor='#fff8dc' w='60%'
                                >
                                    {
                                        reasonData?.map((reason, i) =>
                                            <option key={i} value={reason.reasonName}>{reason.reasonName}</option>
                                        )
                                    }
                                </Select>
                                : 'loading'
                        } */}
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <ButtonGroup size='sm' mt={7}>
                        <Button
                            colorScheme='blue'
                        // disabled={!reason} onClick={submitHandler}
                        >
                            Yes
                        </Button>
                        <Button colorScheme='red' onClick={onClose}>No</Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}