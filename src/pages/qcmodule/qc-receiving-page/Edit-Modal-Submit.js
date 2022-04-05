import React, { useState, useEffect, useContext } from 'react'
import { Button, ButtonGroup, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverTrigger, useDisclosure, useToast } from '@chakra-ui/react'
import { ReceivingContext } from '../../../context/ReceivingContext'
import apiClient from '../../../services/apiClient'
import { ToastComponent } from '../../../components/Toast'

export const EditModalSubmit = ({ isSubmitDisabled, receivingId, sumQuantity, submitDataOne, submitDataTwo, submitDataThree, fetchPo, closeModal }) => {

    const { setReceivingId } = useContext(ReceivingContext)

    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()
    const {onClose} = useDisclosure()

    const firstSubmit = { ...submitDataOne, ...submitDataThree }

    const submitEditedHandlder = () => {
        try {
            setIsLoading(true)
            const res = apiClient.put(`Receiving/ReceiveRawMaterialsById/${submitDataOne.pO_Summary_Id}`, firstSubmit
            ).then((res) => {
                ToastComponent("Success!", "PO Updated", "success", toast)
                setReceivingId(res.data.id)
                // setIsLoading(false)
                fetchPo()
                closeModal()

                // take generated id 
                const receivingIdWithoutUseContext = res.data.id

                // final array data for second put
                const secondSubmit = submitDataTwo.map(data => {
                    return {
                        pO_ReceivingId: receivingIdWithoutUseContext,
                        quantity: sumQuantity,
                        remarks: data.remarksName
                    }
                })

                if (sumQuantity > 0) {
                    try {
                        const res = apiClient.put(`Receiving/RejectRawMaterialsByReceivingId`, secondSubmit)
                    } catch (err) {
                        console.log(err)
                    }

                    // proceed to first put error catch if condition for second put is not met
                }
            }
            ).catch(err => {
                setIsLoading(false)
                ToastComponent("Error", err.response.data, "error", toast)
            }
            )
        } catch (err) {
            console.log(err)
        }

    }

    return (
        <Popover
            placement='top-end'
            closeOnBlur={false}
        >
            <PopoverTrigger>
                <Button
                    disabled={isSubmitDisabled}
                    _hover={{ bgColor: 'accent', color: 'white' }}
                    variant='outline'
                >
                    Save
                </Button>
            </PopoverTrigger>
            <PopoverContent color='white' bg='secondary' borderColor='accent'>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                    Are you sure you want to submit?
                </PopoverBody>
                <PopoverFooter
                    border='0'
                    d='flex'
                    alignItems='center'
                    justifyContent='space-between'
                    pb={4}
                >
                    <ButtonGroup size='md'>
                        <Button
                            colorScheme='blue' _hover={{ bgColor: 'accent' }}
                            isLoading={isLoading}
                            onClick={() => submitEditedHandlder()}
                        >
                            Yes
                        </Button>
                    </ButtonGroup>
                </PopoverFooter>
            </PopoverContent>
        </Popover>
    )
}

// // execute second put method if quantity is present on the data
// if (sumQuantity > 0) {
//     window.setTimeout(() => {
//         console.log(secondSubmit)
//         try {
//             const res = apiClient.put(`Receiving/RejectRawMaterialsByReceivingId/${receivingId}`, [secondSubmit])
//         } catch (err) {
//             console.log(err)
//         }
//     }, 500)
// }



    // const firstSubmit = {
    //     pO_Summary_Id: submitDataOne.pO_Summary_Id,
    //     manufacturing_Date: submitDataOne.manufacturing_Date,
    //     expected_Delivery: submitDataOne.expected_Delivery,
    //     expiry_Date: submitDataOne.expiry_Date,
    //     actual_Delivered: submitDataOne.actual_Delivered,
    //     batch_No: submitDataOne.batch_No,
    //     truck_Approval1: submitDataThree.truck_Approval1,
    //     truck_Approval1_Remarks: submitDataThree.truck_Approval1_Remarks,
    //     truck_Approval2: submitDataThree.truck_Approval2,
    //     truck_Approval2_Remarks: submitDataThree.truck_Approval2_Remarks,
    //     truck_Approval3: submitDataThree.truck_Approval3,
    //     truck_Approval3_Remarks: submitDataThree.truck_Approval3_Remarks,
    //     truck_Approval4: submitDataThree.truck_Approval4,
    //     truck_Approval4_Remarks: submitDataThree.truck_Approval4_Remarks,
    //     unloading_Approval1: submitDataThree.unloading_Approval1,
    //     unloading_Approval1_Remarks: submitDataThree.unloading_Approval1_Remarks,
    //     unloading_Approval2: submitDataThree.unloading_Approval2,
    //     unloading_Approval2_Remarks: submitDataThree.unloading_Approval2_Remarks,
    //     unloading_Approval3: submitDataThree.unloading_Approval3,
    //     unloading_Approval3_Remarks: submitDataThree.unloading_Approval3_Remarks,
    //     unloading_Approval4: submitDataThree.unloading_Approval4,
    //     unloading_Approval4_Remarks: submitDataThree.unloading_Approval4_Remarks,
    //     checking_Approval1: submitDataThree.checking_Approval1,
    //     checking_Approval1_Remarks: submitDataThree.checking_Approval1_Remarks,
    //     checking_Approval2: submitDataThree.checking_Approval2,
    //     checking_Approval2_Remarks: submitDataThree.checking_Approval2_Remarks,
    //     qA_Approval: submitDataThree.qA_Approval,
    //     qA_Approval_Remarks: submitDataThree.qA_Approval_Remarks
    // }
