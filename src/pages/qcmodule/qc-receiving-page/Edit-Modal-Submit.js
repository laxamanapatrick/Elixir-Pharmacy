import React, { useState, useContext } from 'react'
import { Button, useToast } from '@chakra-ui/react'
import { ReceivingContext } from '../../../context/ReceivingContext'
import apiClient from '../../../services/apiClient'
import { ToastComponent } from '../../../components/Toast'

export const EditModalSubmit = ({ isSubmitDisabled, po_ReceivingId, submitDataOne, submitDataTwo, submitDataThree, fetchPo, closeModal }) => {

    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const firstSubmit = { ...submitDataOne, ...submitDataThree }
    const secondSubmit = submitDataTwo

    // console.log(firstSubmit)
    // console.log(secondSubmit)

    const submitEditedHandlder = () => {



        if (submitDataTwo) {
            // try {
            const res = apiClient.put(`Receiving/RejectRawMaterialsByReceivingId/${po_ReceivingId}`, secondSubmit)
            // } catch (err) {
            //     console.log(err)
            // }
        }

        try {
            setIsLoading(true)
            const res = apiClient.put(`Receiving/ReceiveRawMaterialsById/${submitDataOne.pO_Summary_Id}`, firstSubmit
            ).then((res) => {
                ToastComponent("Success!", "PO Updated", "success", toast)
                fetchPo()
                closeModal()
                setIsLoading(false)
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
        <Button
            onClick={() => submitEditedHandlder()}
            disabled={isSubmitDisabled}
            isLoading={isLoading}
            _hover={{bgColor: 'accent', color:'white'}}
            variant='outline'
        >
            Save
        </Button>
    )
}



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
