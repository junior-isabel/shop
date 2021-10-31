import dynamic from "next/dynamic";
import { useUI } from "@contexts/ui.context";
import { useRouter } from 'next/router'
import Modal from "@components/common/modal/modal";
const Login = dynamic(() => import("@components/auth/login"));
const Register = dynamic(() => import("@components/auth/register"));

const ForgotPassword = dynamic(
  () => import("@components/auth/forget-password/forget-password")
);
const PaymentForm = dynamic(() => import("@components/checkout/payment-form"));
const ProductDetailsModalView = dynamic(
  () => import("@components/product/product-details-modal-view")
);
const CreateOrUpdateAddressForm = dynamic(
  () => import("@components/address/address-form")
);
const AddressDeleteView = dynamic(
  () => import("@components/address/address-delete-view")
);

const ModalContainer = () => {
  const { displayModal, closeModal, modalView, modalData } = useUI();
  const router = useRouter()
  function onCloseModal (status) {
    const url: URL = new URL(window.location)
    if (url.pathname.substr(0, 2) == '/a' && !status) {
      closeModal()
     // window.history.back()
     // return
      url.pathname = ''
      //window.history.pushState({}, '', url)
      // router.prefetch('/')
      window.history.replaceState({}, '', url)
      
      
    }
  }
  return (
    <Modal open={displayModal} onClose={onCloseModal}>
      {modalView === "LOGIN_VIEW" && <Login />}
      {modalView === "REGISTER" && <Register />}
      {modalView === "FORGOT_VIEW" && <ForgotPassword />}
      {modalView === "ADD_OR_UPDATE_ADDRESS" && <CreateOrUpdateAddressForm />}
      {modalView === "DELETE_ADDRESS" && <AddressDeleteView />}
      {modalView === "ADD_CARD_INFO" && <PaymentForm />}
      {modalView === "PRODUCT_DETAILS" && (
        <ProductDetailsModalView productSlug={modalData} />
      )}
    </Modal>
  );
};

export default ModalContainer;
