import React from 'react'
import { Button, ButtonGroup, Flex, useDisclosure } from '@chakra-ui/react'
import { CancelConfirmation, EditModal, SaveConfirmation } from './Action-Modals'

export const ActionButtons = ({ listDataTempo, setListDataTempo, selectorId, rowIndex, totalQuantity, supplierData, supplierRef, setDetails, setRawMatsInfo,
    remarks, setRemarks, remarksRef, transactionDate }) => {

    const { isOpen: isEdit, onClose: closeEdit, onOpen: openEdit } = useDisclosure()
    const editHandler = () => {
        openEdit()
    }

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
                    <Button colorScheme='blue' px={5} disabled={listDataTempo.length === 0} onClick={saveHandler}>Save</Button>
                    <Button colorScheme='red' px={3} disabled={!selectorId} onClick={cancelHandler}>Cancel</Button>
                </ButtonGroup>
            </Flex>

            {
                isEdit && (
                    <EditModal
                        isOpen={isEdit}
                        onClose={closeEdit}
                        selectorId={selectorId}
                        rowIndex={rowIndex}
                        setListDataTempo={setListDataTempo}
                        listDataTempo={listDataTempo}
                    />
                )
            }

            {
                isSave && (
                    <SaveConfirmation
                        isOpen={isSave}
                        onClose={closeSave}
                        listDataTempo={listDataTempo}
                        setListDataTempo={setListDataTempo}
                        totalQuantity={totalQuantity}
                        supplierData={supplierData}
                        supplierRef={supplierRef}
                        setDetails={setDetails}
                        setRawMatsInfo={setRawMatsInfo}
                        remarks={remarks}
                        setRemarks={setRemarks}
                        remarksRef={remarksRef}
                        transactionDate={transactionDate}
                    />
                )
            }

            {
                isCancel && (
                    <CancelConfirmation
                        isOpen={isCancel}
                        onClose={closeCancel}
                        selectorId={selectorId}
                        rowIndex={rowIndex}
                        setListDataTempo={setListDataTempo}
                        listDataTempo={listDataTempo}
                    />
                )
            }

        </>
    )
}
