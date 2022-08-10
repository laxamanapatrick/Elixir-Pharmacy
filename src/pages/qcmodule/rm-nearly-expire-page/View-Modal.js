import React, { useEffect, useState } from 'react'
import { Button, Flex, FormLabel, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Stack, Text } from '@chakra-ui/react'
import apiClient from '../../../services/apiClient'
import PageScrollQCModal from '../../../components/PageScrollQCModal'

const fetchViewDataApi = async (receivingId) => {
    const res = await apiClient.get(`Receiving/GetDetailsForNearlyExpire?id=${receivingId}`)
    return res.data
}

export const ViewModal = ({ isOpen, onClose, receivingId }) => {

    const [viewData, setViewData] = useState([])

    const fetchViewData = () => {
        fetchViewDataApi(receivingId).then(res => {
            setViewData(res)
        })
    }

    useEffect(() => {
        fetchViewData()

        return () => {
            setViewData([])
        }
    }, [receivingId])


    console.log(viewData)

    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered size='6xl'>
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent='center'>
                        <Text>PO Summary</Text>
                    </Flex>
                </ModalHeader>
                <ModalBody mt={2}>

                    <PageScrollQCModal>

                        <Stack spacing={5}>

                            {/* Raw mats info */}
                            <Flex justifyContent='center' p={1} color='white' bgColor='secondary'>
                                <Text>RAW MATERIALS INFORMATION</Text>
                            </Flex>

                            <Flex justifyContent='space-between'>
                                <FormLabel w='40%'>
                                    Item Code
                                    <Input
                                        value={viewData[0]?.pO_Number}
                                        readOnly={true}
                                        _disabled={{ color: 'black' }}
                                        disabled={true}
                                        bgColor='gray.300'
                                    />
                                </FormLabel>

                                <FormLabel w='40%'>
                                    Item Description
                                    <Input
                                        value={viewData[0]?.pO_Date}
                                        readOnly={true}
                                        _disabled={{ color: 'black' }}
                                        disabled={true}
                                        bgColor='gray.300'
                                    />
                                </FormLabel>
                            </Flex>
                            <Flex justifyContent='space-between'>
                                <FormLabel w='40%'>
                                    Supplier
                                    <Input
                                        value={viewData[0]?.supplier}
                                        readOnly={true}
                                        _disabled={{ color: 'black' }}
                                        disabled={true}
                                        bgColor='gray.300'
                                    />
                                </FormLabel>

                                <FormLabel w='40%'>
                                    Date of Checking
                                    <Input
                                        value={viewData[0]?.dateOfChecking}
                                        readOnly={true}
                                        _disabled={{ color: 'black' }}
                                        disabled={true}
                                        bgColor='gray.300'
                                    />
                                </FormLabel>
                            </Flex>

                            {/* Receiving Info */}
                            <Flex justifyContent='center' p={1} color='white' bgColor='secondary'>
                                <Text>RECEIVING INFORMATION</Text>
                            </Flex>

                            <Flex justifyContent='space-between'>
                                <FormLabel w='40%'>
                                    PO NO.
                                    <Input
                                        value={viewData[0]?.pO_Number}
                                        readOnly={true}
                                        _disabled={{ color: 'black' }}
                                        disabled={true}
                                        bgColor='gray.300'
                                    />
                                </FormLabel>

                                <FormLabel w='40%'>
                                    PO Date
                                    <Input
                                        value={viewData[0]?.pO_Date}
                                        readOnly={true}
                                        _disabled={{ color: 'black' }}
                                        disabled={true}
                                        bgColor='gray.300'
                                    />
                                </FormLabel>
                            </Flex>
                            <Flex justifyContent='space-between'>
                                <FormLabel w='40%'>
                                    PR No.
                                    <Input
                                        value={viewData[0]?.pR_Number}
                                        readOnly={true}
                                        _disabled={{ color: 'black' }}
                                        disabled={true}
                                        bgColor='gray.300'
                                    />
                                </FormLabel>

                                <FormLabel w='40%'>
                                    PR Date
                                    <Input
                                        value={viewData[0]?.pR_Date}
                                        readOnly={true}
                                        _disabled={{ color: 'black' }}
                                        disabled={true}
                                        bgColor='gray.300'
                                    />
                                </FormLabel>
                            </Flex>
                            <Flex justifyContent='space-between'>
                                <FormLabel w='40%'>
                                    Quantity Ordered
                                    <Input
                                        value={viewData[0]?.quantityOrdered}
                                        readOnly={true}
                                        _disabled={{ color: 'black' }}
                                        disabled={true}
                                        bgColor='gray.300'
                                    />
                                </FormLabel>

                                <FormLabel w='40%'>
                                    UOM
                                    <Input
                                        value={'NONE'}
                                        readOnly={true}
                                        _disabled={{ color: 'black' }}
                                        disabled={true}
                                        bgColor='gray.300'
                                    />
                                </FormLabel>
                            </Flex>
                            <Flex justifyContent='space-between'>
                                <FormLabel w='40%'>
                                    Manufacturing Date
                                    <Input
                                        value={viewData[0]?.manufacturingDate}
                                        readOnly={true}
                                        _disabled={{ color: 'black' }}
                                        disabled={true}
                                        bgColor='gray.300'
                                    />
                                </FormLabel>

                                <FormLabel w='40%'>
                                    Expiry Date
                                    <Input
                                        value={viewData[0]?.expiryDate}
                                        readOnly={true}
                                        _disabled={{ color: 'black' }}
                                        disabled={true}
                                        bgColor='gray.300'
                                    />
                                </FormLabel>
                            </Flex>
                            <Flex justifyContent='space-between'>
                                <FormLabel w='40%'>
                                    Expected Delivery
                                    <Input
                                        value={`None`}
                                        readOnly={true}
                                        _disabled={{ color: 'black' }}
                                        disabled={true}
                                        bgColor='gray.300'
                                    />
                                </FormLabel>

                                <FormLabel w='40%'>
                                    Quantity Actual Delivered
                                    <Input
                                        value={`None`}
                                        readOnly={true}
                                        _disabled={{ color: 'black' }}
                                        disabled={true}
                                        bgColor='gray.300'
                                    />
                                </FormLabel>
                            </Flex>
                            <Flex justifyContent='space-between'>
                                <FormLabel w='40%'>
                                    No. Qty Actual Good Needed
                                    <Input
                                        value={`None`}
                                        readOnly={true}
                                        _disabled={{ color: 'black' }}
                                        disabled={true}
                                        bgColor='gray.300'
                                    />
                                </FormLabel>

                                <FormLabel w='40%'>
                                    Batch No.
                                    <Input
                                        value={`None`}
                                        readOnly={true}
                                        _disabled={{ color: 'black' }}
                                        disabled={true}
                                        bgColor='gray.300'
                                    />
                                </FormLabel>
                            </Flex>

                            {/* Rejection Info */}
                            <Flex justifyContent='center' p={1} color='white' bgColor='secondary'>
                                <Text>REJECTION INFORMATION</Text>
                            </Flex>

                            <Flex justifyContent='Center'>
                                <FormLabel w='40%'>
                                    NONE
                                    <Input
                                        value={`NONE`}
                                        readOnly={true}
                                        _disabled={{ color: 'black' }}
                                        disabled={true}
                                        bgColor='gray.300'
                                    />
                                </FormLabel>
                            </Flex>

                            {/* Checklists Info -- TRUCK INSPECTION */}
                            <Flex justifyContent='space-between' p={1} color='white' bgColor='secondary'>
                                <Text w='40%'>TRUCK INSPECTION</Text>
                                <Text w='20%' ml={2}>Yes/No</Text>
                                <Text w='40%'>Remarks</Text>
                            </Flex>
                            <Flex justifyContent='space-between'>
                                <Text w='40%'>
                                    The trucks are covered and closed
                                </Text>
                                <Text w='20%' ml={2}>
                                    {viewData[0]?.truckApproval1 ? 'Yes' : 'No'}
                                </Text>
                                <Text w='40%'>
                                    {viewData[0]?.truckApprovalRemarks1 ? viewData[0]?.truckApprovalRemarks1 : 'No Remarks'}
                                </Text>
                            </Flex>
                            <Flex justifyContent='space-between'>
                                <Text w='40%'>
                                    Floorboards are dry and clean
                                </Text>
                                <Text w='20%' ml={2}>
                                    {viewData[0]?.truckApproval2 ? 'Yes' : 'No'}
                                </Text>
                                <Text w='40%'>
                                    {viewData[0]?.truckApprovalRemarks2 ? viewData[0]?.truckApprovalRemarks2 : 'No Remarks'}
                                </Text>
                            </Flex>
                            <Flex justifyContent='space-between'>
                                <Text w='40%'>
                                    No evidence of chemical piils, garbage, waste or spoiled foods
                                </Text>
                                <Text w='20%' ml={2}>
                                    {viewData[0]?.truckApproval3 ? 'Yes' : 'No'}
                                </Text>
                                <Text w='40%'>
                                    {viewData[0]?.truckApprovalRemarks3 ? viewData[0]?.truckApprovalRemarks3 : 'No Remarks'}
                                </Text>
                            </Flex>
                            <Flex justifyContent='space-between'>
                                <Text w='40%'>
                                    No insect and rodent activity
                                </Text>
                                <Text w='20%' ml={2}>
                                    {viewData[0]?.truckApproval4 ? 'Yes' : 'No'}
                                </Text>
                                <Text w='40%'>
                                    {viewData[0]?.truckApprovalRemarks4 ? viewData[0]?.truckApprovalRemarks4 : 'No Remarks'}
                                </Text>
                            </Flex>

                            {/* Checklists Info -- UNLOADING OF RAW MATERIALS */}
                            <Flex justifyContent='space-between' p={1} color='white' bgColor='secondary'>
                                <Text w='40%'>UNLOADING OF RAW MATERIALS</Text>
                                <Text w='20%' ml={2}>Yes/No</Text>
                                <Text w='40%'>Remarks</Text>
                            </Flex>
                            <Flex justifyContent='space-between'>
                                <Text w='40%'>
                                    All products are on clean pallets (if applicable)
                                </Text>
                                <Text w='20%' ml={2}>
                                    {viewData[0]?.unloadingApproval1 ? 'Yes' : 'No'}
                                </Text>
                                <Text w='40%'>
                                    {viewData[0]?.unloadingApprovalRemarks1 ? viewData[0]?.unloadingApprovalRemarks1 : 'No Remarks'}
                                </Text>
                            </Flex>
                            <Flex justifyContent='space-between'>
                                <Text w='40%'>
                                    No damage packaging
                                </Text>
                                <Text w='20%' ml={2}>
                                    {viewData[0]?.unloadingApproval2 ? 'Yes' : 'No'}
                                </Text>
                                <Text w='40%'>
                                    {viewData[0]?.unloadingApprovalRemarks2 ? viewData[0]?.unloadingApprovalRemarks2 : 'No Remarks'}
                                </Text>
                            </Flex>
                            <Flex justifyContent='space-between'>
                                <Text w='40%'>
                                    All packing are clean
                                </Text>
                                <Text w='20%' ml={2}>
                                    {viewData[0]?.unloadingApproval3 ? 'Yes' : 'No'}
                                </Text>
                                <Text w='40%'>
                                    {viewData[0]?.unloadingApprovalRemarks3 ? viewData[0]?.unloadingApprovalRemarks3 : 'No Remarks'}
                                </Text>
                            </Flex>
                            <Flex justifyContent='space-between'>
                                <Text w='40%'>
                                    Batch number, manufacturing and expiry are same as written in the Certificate on Analysis (COA) provided by supplier
                                </Text>
                                <Text w='20%' ml={2}>
                                    {viewData[0]?.unloadingApproval4 ? 'Yes' : 'No'}
                                </Text>
                                <Text w='40%'>
                                    {viewData[0]?.unloadingApprovalRemarks4 ? viewData[0]?.unloadingApprovalRemarks4 : 'No Remarks'}
                                </Text>
                            </Flex>

                            {/* Checklists Info -- CHECKING OF PHYSICAL APPEARANCE / SAMPLING */}
                            <Flex justifyContent='space-between' p={1} color='white' bgColor='secondary'>
                                <Text w='40%'>CHECKING OF PHYSICAL APPEARANCE / SAMPLING</Text>
                                <Text w='20%' ml={2}>Yes/No</Text>
                                <Text w='40%'>Remarks</Text>
                            </Flex>
                            <Flex justifyContent='space-between'>
                                <Text w='40%'>
                                    The delivered raw materials has the same color/appearance
                                </Text>
                                <Text w='20%' ml={2}>
                                    {viewData[0]?.checkingApproval1 ? 'Yes' : 'No'}
                                </Text>
                                <Text w='40%'>
                                    {viewData[0]?.checkingApprovalRemarks1 ? viewData[0]?.checkingApprovalRemarks1 : 'No Remarks'}
                                </Text>
                            </Flex>
                            <Flex justifyContent='space-between'>
                                <Text w='40%'>
                                    No foreign materials in the packaging and in the content of raw material
                                </Text>
                                <Text w='20%' ml={2}>
                                    {viewData[0]?.checkingApproval2 ? 'Yes' : 'No'}
                                </Text>
                                <Text w='40%'>
                                    {viewData[0]?.checkingApprovalRemarks2 ? viewData[0]?.checkingApprovalRemarks2 : 'No Remarks'}
                                </Text>
                            </Flex>

                            {/* Checklists Info -- QA CHECKLIST APPROVAL */}
                            <Flex justifyContent='space-between' p={1} color='white' bgColor='secondary'>
                                <Text w='40%'>QA CHECKLIST APPROVAL</Text>
                                <Text w='20%' ml={2}>Yes/No</Text>
                                <Text w='40%'>Remarks</Text>
                            </Flex>
                            <Flex justifyContent='space-between'>
                                <Text w='40%'>
                                    The item selected. If approved in our QA basic mark as approved or else reject.
                                </Text>
                                <Text w='20%' ml={2}>
                                    {viewData[0]?.qaApproval ? 'Yes' : 'No'}
                                </Text>
                                <Text w='40%'>
                                    {viewData[0]?.qaApprovalRemarks ? viewData[0]?.qaApprovalRemarks : 'No Remarks'}
                                </Text>
                            </Flex>

                        </Stack>

                    </PageScrollQCModal>

                </ModalBody>
                <ModalFooter mt={10}>
                    <Button variant='ghost' size='xs' onClick={onClose}>Close</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
