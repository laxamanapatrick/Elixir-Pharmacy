import React from 'react'
import { Button, ButtonGroup, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text, toast, useToast, VStack } from '@chakra-ui/react'
import { BsQuestionDiamondFill } from 'react-icons/bs'
import apiClient from '../../../services/apiClient'
import { ToastComponent } from '../../../components/Toast'
import { decodeUser } from '../../../services/decode-user'
import moment from 'moment'
import { useReactToPrint } from 'react-to-print';
import Barcode from 'react-barcode';

const currentUser = decodeUser()

export const TransactConfirmation = ({ isOpen, onClose, moveOrderListThirdTable, deliveryDate, setMoveOrderInformation, fetchMoveOrderList }) => {

    const toast = useToast()

    const submitHandler = () => {
        try {
            const res = apiClient.post(`Ordering/TransactListOfMoveOrders`,
                moveOrderListThirdTable?.map(item => {
                    return {
                        orderNo: item.orderNo,
                        orderDate: moment(item.orderDate).format("yyyy-MM-DD"),
                        dateNeeded: moment(item.dateNeeded).format("yyyy-MM-DD"),
                        warehouseId: item.barcodeNo,
                        farmType: item.farmType,
                        farmName: item.farmName,
                        farmCode: item.farmCode,
                        category: item.category,
                        itemCode: item.itemCode,
                        itemDescription: item.itemDescription,
                        uom: item.uom,
                        expirationDate: moment(item.expiration).format("yyyy-MM-DD"),
                        quantityOrdered: item.quantity,
                        deliveryStatus: item.deliveryStatus,
                        orderNoPKey: item.orderNoPKey,
                        deliveryDate: moment(deliveryDate).format("yyyy-MM-DD"),
                        isApprove: item.isApprove,
                        preparedBy: currentUser.userName
                    }
                })
                // [
                //     {
                //         "orderno": 1,
                //         "orderdate": "2022-06-11",
                //         "dateneeded": "2022-06-11",
                //         "warehouseid": 24045,
                //         "farmtype": "POULTRY",
                //         "farmname": "BrFarm - Magalang",
                //         "farmcode": "334",
                //         "category": "FrmSup",
                //         "itemcode": "ANTI002",
                //         "itemdescription": "AMOX %2",
                //         "uom": "EA",
                //         "expirationdate": "2022-09-16",
                //         "quantityordered": 10,
                //         "platenumber": "EHS 228",
                //         "ordernopkey": 7441,
                //         "deliverydate": "2022-07-13",
                //         "isApprove": true,
                //         "preparedBy": "Pat"
                //     }
                // ]
            )
                .then(res => {
                    ToastComponent("Success", "Move order transacted", "success", toast)
                    setMoveOrderInformation([])
                    fetchMoveOrderList()
                    onClose()
                })
                .catch(err => {
                    ToastComponent("Error", "Transaction failed", "error", toast)
                })
        } catch (error) {
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered size='xl'>
            <ModalContent>
                <ModalHeader>
                    <Flex justifyContent='center'>
                        <BsQuestionDiamondFill fontSize='45px' />
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />
                <ModalBody>
                    <Flex justifyContent='center' mt={7}>
                        <Text>Are you sure you want to transact this move order?</Text>
                    </Flex>
                </ModalBody>
                <ModalFooter>
                    <ButtonGroup size='sm' mt={7}>
                        <Button colorScheme='blue' onClick={submitHandler}>Yes</Button>
                        <Button colorScheme='red' onClick={onClose}>No</Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
