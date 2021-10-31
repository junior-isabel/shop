import ConfirmationCard from "@components/common/confirmation-card";
import { useUI } from "@contexts/ui.context";
import { useDeleteAddressMutation } from "@data/customer/use-address.mutation";

const AddressDeleteView = () => {
  const { closeModal, modalData } = useUI();
  const { mutate: deleteAddressById, isLoading } = useDeleteAddressMutation();

  function handleDelete() {
    deleteAddressById({ id: modalData.addressId });
    return closeModal();
  }
  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnLoading={isLoading}
    />
  );
};

export default AddressDeleteView;
