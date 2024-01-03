import { 
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Button
} from '@chakra-ui/react';

export default function DiscardChangesModal({ isOpen, onClose, cancelRef, discardChange }) {
  return (
    <AlertDialog
      motionPreset='slideInBottom'
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>Discard Changes?</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          All your changes will be lost. This cannot be undone.
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button size='sm' h='36px' color='#283d52' ref={cancelRef} onClick={onClose}>
            Cancel
          </Button>
          <Button size='sm' h='36px' colorScheme='blue' ml={3} onClick={discardChange}>
            Discard
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}