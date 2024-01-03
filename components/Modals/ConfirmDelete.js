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

export default function ConfirmDeleteModal({ isOpen, onClose, cancelRef, confirmDelete }) {
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
        <AlertDialogHeader>Delete Option Sets?</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
          Are you sure to delete these option sets? This cannot be undone.
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button size='sm' h='36px' color='#283d52' ref={cancelRef} onClick={onClose}>
            Cancel
          </Button>
          <Button size='sm' h='36px' colorScheme='blue' ml={3} onClick={confirmDelete}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}