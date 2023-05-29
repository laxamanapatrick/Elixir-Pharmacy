import React, { useState } from 'react'
import { Button, ButtonGroup, Flex, useDisclosure } from '@chakra-ui/react'
import { AllCancelConfirmation, SaveConfirmation } from './Action-Modal'

export const ActionButton = ({ selectorId, setSelectorId, totalQuantity, customerData, details,
    warehouseId, miscData, setTotalQuantity, fetchActiveMiscIssues, isLoading, setIsLoading, customerRef, 
    setDetails, setRawMatsInfo, fetchExpiryDates, remarks, setRemarks, remarksRef, transactionDate 
}) => {

    const [hideButton, setHideButton] = useState(false)

    const { isOpen: isSave, onClose: closeSave, onOpen: openSave } = useDisclosure()
    const saveHandler = () => {
        setHideButton(true)
        openSave()
    }

    const { isOpen: allIsCancel, onClose: allCloseCancel, onOpen: openAllCancel } = useDisclosure()
    const cancelHandler = () => {
        openAllCancel()
    }

    return (
        <>
            <Flex w='full' justifyContent='end'>
                <ButtonGroup size='xs'>
                    {/* <Button colorScheme='yellow' color='white' px={5} disabled={!selectorId} onClick={editHandler}>Edit</Button> */}
                    <Button
                        onClick={saveHandler}
                        disabled={miscData.length === 0 || isLoading || hideButton}
                        isLoading={isLoading}
                        colorScheme='blue' px={5}
                    >
                        Save
                    </Button>
                    <Button colorScheme='red' px={3} disabled={miscData.length === 0 || isLoading || hideButton} onClick={cancelHandler}>Cancel All</Button>
                </ButtonGroup>
            </Flex>

            {
                isSave && (
                    <SaveConfirmation
                        isOpen={isSave}
                        onClose={closeSave}
                        totalQuantity={totalQuantity} setTotalQuantity={setTotalQuantity}
                        customerData={customerData}
                        details={details}
                        miscData={miscData}
                        fetchActiveMiscIssues={fetchActiveMiscIssues}
                        warehouseId={warehouseId}
                        isLoading={isLoading} setIsLoading={setIsLoading}
                        customerRef={customerRef}
                        setDetails={setDetails}
                        setRawMatsInfo={setRawMatsInfo}
                        setHideButton={setHideButton}
                        remarks={remarks} setRemarks={setRemarks} remarksRef={remarksRef}
                        transactionDate={transactionDate}
                    />
                )
            }

            {
                allIsCancel && (
                    <AllCancelConfirmation
                        isOpen={allIsCancel}
                        onClose={allCloseCancel}
                        miscData={miscData}
                        setSelectorId={setSelectorId}
                        fetchActiveMiscIssues={fetchActiveMiscIssues}
                        setHideButton={setHideButton}
                        fetchExpiryDates={fetchExpiryDates}
                    />
                )
            }

        </>
    )
}
