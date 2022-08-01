import React from 'react'
import { Button, ButtonGroup, Flex, useDisclosure } from '@chakra-ui/react'
import { CancelConfirmation, EditModal, SaveConfirmation } from './Action-Modal'

export const ActionButton = ({ selectorId, setSelectorId, totalQuantity, customerData, details,
    warehouseId, miscData, setTotalQuantity, fetchActiveMiscIssues, isLoading, setIsLoading, customerRef, setDetails, setRawMatsInfo
}) => {

    const { isOpen: isSave, onClose: closeSave, onOpen: openSave } = useDisclosure()
    const saveHandler = () => {
        openSave()
    }

    const { isOpen: isCancel, onClose: closeCancel, onOpen: openCancel } = useDisclosure()
    const cancelHandler = () => {
        openCancel()
    }

    return (
        <>
            <Flex w='full' justifyContent='end'>
                <ButtonGroup size='xs'>
                    {/* <Button colorScheme='yellow' color='white' px={5} disabled={!selectorId} onClick={editHandler}>Edit</Button> */}
                    <Button colorScheme='blue' px={5} isLoading={isLoading} disabled={miscData.length === 0 || isLoading} onClick={saveHandler}>Save</Button>
                    <Button colorScheme='red' px={3} disabled={!selectorId} onClick={cancelHandler}>Cancel</Button>
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
                    />
                )
            }

            {
                isCancel && (
                    <CancelConfirmation
                        isOpen={isCancel}
                        onClose={closeCancel}
                        selectorId={selectorId}
                        setSelectorId={setSelectorId}
                        fetchActiveMiscIssues={fetchActiveMiscIssues}
                    />
                )
            }

        </>
    )
}
